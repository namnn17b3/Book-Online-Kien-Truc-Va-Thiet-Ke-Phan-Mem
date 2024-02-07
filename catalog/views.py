from bookonline.base_view import BaseView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from .models import *

# Create your views here.


class CategoryView(BaseView):
    def get(self, request: Request, *args, **kwargs):
        page = 1 if request.GET.get('page') is None else int(request.GET.get('page'))
        item_in_page = 10 if request.GET.get('itemInPage') is None else int(request.GET.get('itemInPage'))
        records = Category.objects.all()
        start = (page - 1) * item_in_page
        end = start + item_in_page if start + item_in_page <= len(records) else len(records)
        data_response = None
        if request.GET.get('keyWord') is None:
            data_response = {
                'page': page,
                'itemInPage': item_in_page,
                'allRecords': len(records),
                'items': [
                    {
                        'id': item.id,
                        'title': item.title,
                        'description': item.description,
                        'image': f'./static/category/image/{item.image}'
                    }
                    for item in records[start:end]
                ]
            }
        else:
            keyWord = request.GET.get('keyWord')
            data_response = {
                'page': page,
                'itemInPage': item_in_page,
                'allRecords': len(records),
                'items': [
                    {
                        'id': item.id,
                        'title': item.title,
                        'description': item.description,
                        'image': f'./static/category/image/{item.image}'
                    }
                    for item in Category.objects.filter(title__icontains=keyWord)[start:end]
                ]
            }
        return Response(data=data_response, content_type='application/json', status=status.HTTP_200_OK)
