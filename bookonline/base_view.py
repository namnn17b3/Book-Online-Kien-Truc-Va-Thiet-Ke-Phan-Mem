from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema


class BaseView(APIView):
    base_res: str = {
        "statusCode": 405,
        "message": "Method is not allowed"
    }

    @swagger_auto_schema(auto_schema=None)
    def get(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)
    def post(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)
    def put(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)
    def patch(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)
    def delete(self, request: Request, *args, **kwargs):
        return Response(data=self.base_res, content_type='application/json', status=status.HTTP_405_METHOD_NOT_ALLOWED)
