from django.urls import path
from . import views


app_name = 'product'

urlpatterns = [
    path('api/product/<int:id>', view=views.ProductView.as_view(), name='product-view-detail'),
]
