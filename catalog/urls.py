from django.urls import path
from . import views


app_name = 'catalog'

urlpatterns = [
    path('api/catalog/', view=views.CategoryView.as_view(), name='category-view'),
]
