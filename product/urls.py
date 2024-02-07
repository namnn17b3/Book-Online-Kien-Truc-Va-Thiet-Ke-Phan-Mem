from django.urls import path
from . import views


app_name = 'product'

urlpatterns = [
    path('api/product/', view=views.ProductView.as_view(), name='product-view'),
    path('api/product/<int:id>', view=views.ProductView.as_view(), name='product-view-with-path-variable'),
    path('api/product/image-search', view=views.ProductImageSearchView.as_view(), name='product-image-search-view'),
]
