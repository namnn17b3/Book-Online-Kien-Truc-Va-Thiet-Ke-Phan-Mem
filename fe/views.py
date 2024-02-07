from django.shortcuts import render
from django.views import View
from django.http import HttpRequest


class LoginView(View):
    def get(self, request: HttpRequest, *args, **kwargs):
        return render(request=request, template_name='login.html', content_type='text/html')


class HomeView(View):
    def get(self, request: HttpRequest, *args, **kwargs):
        return render(request=request, template_name='home.html', content_type='text/html')


class CategoryView(View):
    def get(self, request: HttpRequest, *args, **kwargs):
        return render(request=request, template_name='category.html', content_type='text/html')


class ErrorPageView(View):
    def get(self, request: HttpRequest, exception: Exception):
        return render(request=request, template_name='error_page.html')


# use for BASE_DIR/urls.py:
# handler404 = handle_error_page # or handler404 = 'fe.views.handle_error_page'
# def handle_error_page(request: HttpRequest, exception: Exception):
#     return render(request=request, template_name='error_page.html')
