import pytz

from authen.decorators import use_auth
from bookonline.app_exception import AppException
from bookonline.base_view import BaseView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from authen.decorators import getUserFromToken
from bookonline.settings import TIME_ZONE_APP, MAX_LEN_ITEMS_REQUEST_DTO
from users.models import User
from product.models import Product
from .models import *
from django.db import transaction
from datetime import datetime


# Create your views here.


LIMIT_QUANTITY = 200
LIMIT_QUANTITY_ADDED = 50


class CategoryUserView(BaseView):

    @method_decorator(use_auth())
    def get(self, request: Request, *args, **kwargs):
        access_token = request.headers.get('Authorization').split(' ')[1]
        user: User = getUserFromToken(accessToken=access_token)
        queryset = CartProduct.objects.filter(user_id=user.id).order_by('-updated_at')

        page = 1 if request.GET.get('page') is None else int(request.GET.get('page'))
        item_in_page = 5 if request.GET.get('itemInPage') is None else int(request.GET.get('itemInPage'))
        start = (page - 1) * item_in_page
        end = start + item_in_page if start + item_in_page <= len(queryset) else len(queryset)
        cart_product = [(item, Product.objects.get(id=item.product_id)) for item in queryset[start:end]]

        data_response = {
            'userId': user.id,
            'page': page,
            'itemInPage': item_in_page,
            'allRecords': len(queryset),
            'items': [
                {
                    'productId': item[1].id,
                    'name': item[1].name,
                    'author': item[1].author,
                    'publishDate': item[1].publish_date.strftime('%d/%m/%Y'),
                    'price': item[1].price,
                    'image': item[1].image,
                    'quantity': item[0].quantity,
                    'category': item[1].category.title,
                    'createdAt': item[0].created_at.replace(tzinfo=pytz.utc).astimezone(TIME_ZONE_APP).strftime(
                        '%d/%m/%Y %H:%M:%S'),
                    'updatedAt': item[0].updated_at.replace(tzinfo=pytz.utc).astimezone(TIME_ZONE_APP).strftime(
                        '%d/%m/%Y %H:%M:%S')
                }
                for item in cart_product
            ]
        }
        return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)

    @transaction.atomic
    @method_decorator(use_auth())
    def post(self, request: Request, *args, **kwargs):
        access_token = request.headers.get('Authorization').split(' ')[1]
        user: User = getUserFromToken(accessToken=access_token)
        try:
            with transaction.atomic(using='mysql'):
                product_id = int(request.data.get('productId') + 0)
                quantity = int(request.data.get('quantity') + 0)
                if quantity > LIMIT_QUANTITY_ADDED or quantity <= 0:
                    raise AppException(message=f'Quantity Added must be in range (1; {LIMIT_QUANTITY_ADDED})')

                cart_product: CartProduct = CartProduct.objects.filter(user_id=user.id).filter(product_id=product_id)
                if len(cart_product) == 0:
                    cart_product = CartProduct(user_id=user.id, product_id=product_id, quantity=quantity)
                    cart_product.save()
                else:
                    cart_product = cart_product[0]
                    cart_product.quantity = cart_product.quantity + quantity
                    cart_product.save()
        except Exception as error:
            print(error)
            raise error

        quantities = len(CartProduct.objects.all())
        return Response(data={'message': 'Add product to cart successfully', 'quantities': quantities}, content_type='application/json',
                        status=status.HTTP_200_OK)


    @transaction.atomic
    @method_decorator(use_auth())
    def put(self, request: Request, *args, **kwargs):
        access_token = request.headers.get('Authorization').split(' ')[1]
        user: User = getUserFromToken(accessToken=access_token)

        items: list = request.data.get('items')
        if items is None:
            raise AppException(message='Require Items not null')

        if len(items) > MAX_LEN_ITEMS_REQUEST_DTO:
            raise AppException(message=f'Items size less or equals {MAX_LEN_ITEMS_REQUEST_DTO}')

        items_response = []
        try:
            with transaction.atomic(using='mysql'):
                for item in items:
                    product_id = int(item.get('productId') + 0)
                    cart_product = CartProduct.objects.filter(user_id=user.id, product_id=product_id)
                    if len(cart_product) == 0:
                        raise AppException(message='Product not exists')

                    quantity = int(item.get('quantity') + 0)
                    if quantity > LIMIT_QUANTITY or quantity <= 0:
                        raise AppException(message=f'Quantity must be in range (1; {LIMIT_QUANTITY_ADDED})')

                    cart_product = cart_product[0]
                    cart_product.quantity = quantity
                    cart_product.updated_at = datetime.utcnow()
                    cart_product.save()
                    items_response.append({
                        'productId': product_id,
                        'updatedAt': cart_product.updated_at.replace(tzinfo=pytz.utc).astimezone(TIME_ZONE_APP).strftime(
                            '%d/%m/%Y %H:%M:%S')
                    })
        except AppException as error:
            print(error)
            raise error

        return Response(data={'status': 200, 'message': 'Update cart successfully', 'items': items_response},
                        content_type='application/json', status=status.HTTP_200_OK)


    @transaction.atomic
    @method_decorator(use_auth())
    def delete(self, request: Request, *args, **kwargs):
        access_token = request.headers.get('Authorization').split(' ')[1]
        user: User = getUserFromToken(accessToken=access_token)

        items: list = request.data.get('items')
        if items is None:
            raise AppException(message='Require Items not null')

        if len(items) > MAX_LEN_ITEMS_REQUEST_DTO:
            raise AppException(message=f'Items size less or equals {MAX_LEN_ITEMS_REQUEST_DTO}')

        try:
            with transaction.atomic(using='mysql'):
                for item in items:
                    product_id = int(item.get('productId') + 0)
                    cart_product = CartProduct.objects.filter(user_id=user.id, product_id=product_id)
                    if len(cart_product) == 0:
                        raise AppException(message='Product not exists')

                    cart_product.delete()
        except AppException as error:
            print(error)
            raise error

        return Response(data={'status': 200, 'message': 'Delete product from cart successfully'}, content_type='application/json',
                        status=status.HTTP_200_OK)
