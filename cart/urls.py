from django.urls import path
from . import views


app_name = 'cart'

urlpatterns = [
    path('api/user/cart', view=views.CategoryUserView.as_view(), name='category-user-view'),
]
