from datetime import datetime
import random
from bookonline.settings import EMAIL_HOST_USER

from django.core.mail import send_mail
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

import jwt
from bookonline.base_view import BaseView
from django.utils.decorators import method_decorator

from bookonline.settings import AVATAR_USER_DIR
from security import generate_sha256_hash, Bcrypt
from utils import save_uploaded_file
from .decorators import use_auth, is_valid_user_register_req_dto, getUserFromToken
from users.models import *

# from drf_yasg.utils import swagger_auto_schema
# from drf_yasg import openapi
# from rest_framework.decorators import api_view
# from drf_spectacular.utils import extend_schema


# Create your views here.

class AuthenAPI:
    class Login(BaseView):
        def post(self, request: Request, *args, **kwargs):
            email = request.data.get('email')
            password = request.data.get('password')

            user = User.objects.filter(email=email)
            if len(user) == 0:
                return Response(data={'statusCode': 401, 'message': 'Email is not exists'}, content_type='application/json',
                                status=status.HTTP_401_UNAUTHORIZED)

            user = user[0]
            if Bcrypt.checkpw(password, user.password) == False:
                return Response(data={'statusCode': 401, 'message': 'Incorrect password'}, content_type='application/json',
                                status=status.HTTP_401_UNAUTHORIZED)

            session = UserSession.objects.filter(user=user)
            if len(session) != 0:
                return Response(data={'statusCode': 401, 'message': 'Account is being logged in elsewhere'}, content_type='application/json',
                                status=status.HTTP_401_UNAUTHORIZED)

            payload: dict = {
                "sub": user.id,
                "email": user.email,
                "phone": user.phone,
                "username": user.username,
                "iat": round(datetime.now().timestamp()),
                "admin": user.is_admin
            }
            access_token = jwt.generate_token(payload)
            data_response = {
                'accessToken': access_token
            }
            session = UserSession(user=user, access_token=access_token)
            session.save()
            return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)

    class Me(BaseView):
        @method_decorator(use_auth())
        def get(self, request: Request, *args, **kwargs):
            access_token = request.headers.get('Authorization').split(' ')[1]
            user: User = getUserFromToken(accessToken=access_token)
            data_response = {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'phone': user.phone,
                'address': user.address,
                'avatar': './static/user/avatar/' + user.avatar
            }
            return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)

    class RefreshToken(BaseView):
        @method_decorator(use_auth(check_session_deleted=False))
        def get(self, request: Request, *args, **kwargs):
            access_token = request.headers.get('Authorization').split(' ')[1]
            try:
                session: UserSession = UserSession.objects.get(
                    access_token=access_token)
                payload = {
                    "sub": session.user.id,
                    "email": session.user.email,
                    "phone": session.user.phone,
                    "username": session.user.username,
                    "iat": round(datetime.now().timestamp()),
                    "admin": session.user.is_admin
                }
                access_token = jwt.generate_token(payload)
                session.access_token = access_token
                session.save()
            except Exception as error:
                print(error)
                return Response(data={'statusCode': 400, 'message': 'Session of user is expire'},
                                content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

            return Response(data={'accessToken': access_token}, content_type='application/json',
                            status=status.HTTP_200_OK)

    class Register(BaseView):
        @method_decorator(is_valid_user_register_req_dto)
        def post(self, request: Request, *args, **kwargs):
            user: User = User(
                email=request.data.get('email'),
                username=request.data.get('username'),
                password=Bcrypt.hashpw(request.data.get('password')),
                phone=request.data.get('phone'),
                address=request.data.get('address')
            )


            try:
                if request.data.get('avatar').__str__() != '':
                    user.avatar = f'{generate_sha256_hash(user.email)}.jpg'

                # exception if email is exists unique db error
                user.save()

                if request.data.get('avatar').__str__() != '':
                    save_uploaded_file(request.data.get(
                        'avatar'), AVATAR_USER_DIR, user.avatar)

                user = User.objects.get(email=user.email)
                payload: dict = {
                    "sub": user.id,
                    "email": user.email,
                    "phone": user.phone,
                    "username": user.username,
                    "iat": round(datetime.now().timestamp()),
                    "admin": user.is_admin
                }
                access_token = jwt.generate_token(payload)
                data_response = {
                    'accessToken': access_token
                }
                session = UserSession(user=user, access_token=access_token)
                session.save()
                return Response(data=data_response, content_type='application/json', status=status.HTTP_201_CREATED)
            except Exception as error:
                print(error)
                return Response(data={'statusCode': 400, 'message': 'Email is exsist'}, content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    class MissingPassword(BaseView):
        def post(self, request: Request, *args, **kwargs):
            email = request.data.get('email')
            if email is None or email == '':
                return Response(data={'statusCode': 400, 'message': 'Email is not empty'}, content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

            user: User = User.objects.filter(email=email)
            if len(user) == 0:
                return Response(data={'statusCode': 400, 'message': 'User is not in system'}, content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

            user = user[0]
            characters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890@#$%^&+='
            newPassword = ''
            for i in range(8):
                newPassword += random.choice(characters)

            user.password = Bcrypt.hashpw(newPassword)
            user.save()
            send_mail(
                'Mật khẩu mới từ Book Online',
                f'Mật khẩu mới của bạn là: {newPassword}\nHãy đăng nhập vào hệ thống và đổi lại mật khẩu nhé!\nChú ý: Đây là mail tự đông, vui lòng không reply!',
                EMAIL_HOST_USER,
                [email]
            )
            return Response(data={'statusCode': 200, 'message': 'Sent new password successfully!'},
                            content_type='application/json', status=status.HTTP_200_OK)

    class Logout(BaseView):
        @method_decorator(use_auth(check_session_deleted=False))
        def get(self, request: Request, *args, **kwargs):
            access_token = request.headers.get('Authorization').split(' ')[1]
            try:
                session: UserSession = UserSession.objects.get(
                    access_token=access_token)
                session.delete()
            except Exception as error:
                print(error)
                return Response(data={'statusCode': 400, 'message': 'Session of user is expire'}, content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

            return Response(data={'statusCode': 200, 'message': 'Logout Success'}, content_type='application/json',
                            status=status.HTTP_200_OK)
