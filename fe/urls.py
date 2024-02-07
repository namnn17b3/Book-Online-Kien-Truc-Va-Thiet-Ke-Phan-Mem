from django.urls import path
from fe import views

app_name = 'fe'

urlpatterns = [
    path('bookonline/login', view=views.LoginView.as_view(), name='fe-login'),
    path('bookonline/', view=views.HomeView.as_view(), name='fe-home'),
    path('bookonline/home', view=views.HomeView.as_view(), name='fe-home'),
    path('bookonline/category', view=views.CategoryView.as_view(), name='fe-category'),
]
