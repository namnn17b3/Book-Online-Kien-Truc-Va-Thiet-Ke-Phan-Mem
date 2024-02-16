from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
import jwt
from bookonline.app_exception import AppException
from users.dto.req.user_register_req_dto import UserRegisterRequestDTO
from users.models import *


def getUserFromToken(accessToken: str) -> User:
    user_session = UserSession.objects.filter(access_token=accessToken)
    if len(user_session) == 0:
        return None

    return user_session[0].user


def use_auth(check_session_deleted=True):
    def decorator(http_method_func):
        def wrapper(request: Request, *args, **kwargs):
            try:
                accessToken: str = request.headers.get('Authorization')
                if accessToken is None:
                    return Response(data={'statusCode': 400, 'message': 'Require Access Token'},
                                    content_type='application/json',
                                    status=status.HTTP_400_BAD_REQUEST)

                accessToken: str = accessToken.split(' ')[1]
                # default check
                if check_session_deleted:
                    jwt_code_check = jwt.valid_token(accessToken)
                    if jwt_code_check == 1:
                        return Response(data={'statusCode': 401, 'message': 'Unauthorized'},
                                        content_type='application/json',
                                        status=status.HTTP_401_UNAUTHORIZED)
                    elif jwt_code_check == 2:
                        return Response(data={'statusCode': 400, 'message': 'Unauthorized'},
                                        content_type='application/json',
                                        status=status.HTTP_400_BAD_REQUEST)

                    session: UserSession = UserSession.objects.filter(access_token=accessToken)
                    if len(session) == 0:
                        return Response(data={'statusCode': 400, 'message': 'Session of user is expire or not exist'}, content_type='application/json',
                            status=status.HTTP_400_BAD_REQUEST)

                response: Response = http_method_func(request, *args, **kwargs)
                return response
            except AppException as error:
                print(error)
                return Response(data={'statusCode': 400, 'message': f'Error: {error}'}, content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        return wrapper
    return decorator


def is_valid_user_register_req_dto(http_method_func):
    def wrapper(request, *args, **kwargs):
        dto: UserRegisterRequestDTO = UserRegisterRequestDTO(
            request.data.get('email'),
            request.data.get('username'),
            request.data.get('password'),
            request.data.get('phone'),
            request.data.get('address'),
            request.data.get('avatar').__str__()
        )
        result: str = dto.is_valid()
        if result != 'OK':
            return Response(data={'statusCode': 400, 'message': result}, content_type='application/json',
                            status=status.HTTP_400_BAD_REQUEST)

        response: Response = http_method_func(request, *args, **kwargs)
        return response

    return wrapper
