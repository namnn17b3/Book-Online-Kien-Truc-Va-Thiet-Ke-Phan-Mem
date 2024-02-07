"""bookonline URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
import fe.views
# from fe.views import handle_error_page
# from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


schema_view = get_schema_view(
    openapi.Info(
        title="Book Online API Swagger",
        default_version='1.0.0',
        description="swagger apis doc for Book Online",
        terms_of_service="https://www.masternamnnptit.id.vn/fruitshop",
        contact=openapi.Contact(email="anhnam2730@gmail.com"),
        license=openapi.License(name="License By namnn.17b3"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authen.urls')),
    path('', include('catalog.urls')),
    path('', include('product.urls')),
    path('', include('cart.urls')),
    path('', include('fe.urls')),
    # path('apidocs', SpectacularAPIView.as_view(), name='apidocs'),
    # path('swagger-ui', SpectacularSwaggerView.as_view(url_name='apidocs'), name='swagger-ui'),
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('bookonline/swagger-ui', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# handler404 = handle_error_page # or handler404 = 'fe.views.handle_error_page'
handler404 = fe.views.ErrorPageView.as_view()
handler500 = fe.views.ErrorPageView.as_view()
