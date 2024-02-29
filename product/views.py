from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from bookonline.base_view import BaseView
from .models import Product

# Create your views here.


class ProductView(BaseView):
    def get(self, request: Request, id=None, format=None):
        product = Product.objects.filter(id=id)
        if len(product) == 0:
            return Response(data={'statusCode': 400, 'message': 'Product is not exists'},
                            content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        else:
            product = product[0]
            data_response = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'quantity': product.quantity,
                'image': f'{product.image}',
                'category': product.category.title
            }
            return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)
