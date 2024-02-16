from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from bookonline.base_view import BaseView
from .models import Product
from catalog.models import *
from cbir import *

# Create your views here.

MIN_PRICE = 10000
MAX_PRICE = 200000


class ProductView(BaseView):

    def __to_int(self, x):
        if x is None:
            return None
        try:
            return int(x) if int(x) > 0 else ''
        except Exception as error:
            return ''

    def get(self, request: Request, id=None, format=None):
        name = request.GET.get('name')
        min_price = self.__to_int(request.GET.get('minPrice'))
        max_price = self.__to_int(request.GET.get('maxPrice'))
        category_id = self.__to_int(request.GET.get('categoryId'))
        queryset = Product.objects.all()
        if id is None:
            if name is not None:
                queryset = queryset.filter(name__icontains=name)

            if min_price is not None and min_price != '':
                queryset = queryset.filter(price__gte=min_price)
            elif min_price == '':
                return Response(data={'statusCode': 400,
                                      'message': f'minPrce: Error Format Integer or min price not in [{MIN_PRICE}, {MAX_PRICE}]'},
                                content_type='application/json', status=status.HTTP_400_BAD_REQUEST)

            if max_price is not None and max_price != '':
                queryset = queryset.filter(price__lte=max_price)
            elif max_price == '':
                return Response(data={'statusCode': 400,
                                      'message': f'maxPrce: Error Format Integer or min price not in [{MIN_PRICE}, {MAX_PRICE}]'},
                                content_type='application/json', status=status.HTTP_400_BAD_REQUEST)

            if category_id is not None and category_id != '':
                category = Category.objects.filter(id=category_id)
                if len(category) == 1:
                    category = category[0]
                    queryset = queryset.filter(category=category)
                else:
                    return Response(data={'statusCode': 400, 'message': 'Category is not exists'},
                                    content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
            elif category_id == '':
                return Response(data={'statusCode': 400, 'message': 'categoryId: Error Format Integer'},
                                content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        else:
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

        page = 1 if request.GET.get('page') is None else int(request.GET.get('page'))
        item_in_page = 10 if request.GET.get('itemInPage') is None else int(request.GET.get('itemInPage'))
        start = (page - 1) * item_in_page
        end = start + item_in_page if start + item_in_page <= len(queryset) else len(queryset)
        data_response = {
            'page': page,
            'itemInPage': item_in_page,
            'allRecords': len(queryset),
            'items': [
                {
                    'id': item.id,
                    'name': item.name,
                    'price': item.price,
                    'quantity': item.quantity,
                    'image': f'{item.image}',
                    'category': item.category.title
                }
                for item in queryset[start:end]
            ]
        }
        return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)


class ProductImageSearchView(BaseView):
    def post(self, request: Request, *args, **kwargs):
        print(request.data.get('image'))
        image: InMemoryUploadedFile = request.data.get('image')
        if image is None:
            return Response(data={'statusCode': 400, 'message': 'Image not empty'}, content_type='application/json',
                            status=status.HTTP_400_BAD_REQUEST)

        image_name = image.__str__()
        if not image_name.endswith('.jpg') and not image_name.endswith('.jpeg') and not image_name.endswith('.png'):
            return Response(data={'statusCode': 400, 'message': 'Only accept image extend file as jpg, jpeg, png'},
                            content_type='application/json', status=status.HTTP_400_BAD_REQUEST)

        nearest_image = CBIR.search(search_image=image, k=10, T=Product)
        # CBIR.plot(nearest_image=nearest_image, k=10, property='image', data_folder_parent='product', data_folder_children='image')

        data_response: dict = {
            'items': [
                {
                    'id': item.id,
                    'name': item.name,
                    'price': item.price,
                    'quantity': item.quantity,
                    'image': f'{item.image}',
                    'category': item.category.title
                }
                for (item, distance) in nearest_image
            ]
        }

        return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)
