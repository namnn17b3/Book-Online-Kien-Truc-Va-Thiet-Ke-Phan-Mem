from django.urls import path
from fe import views

app_name = 'fe'

urlpatterns = [
    path('login', view=views.LoginView.as_view(), name='fe-login'),
    path('', view=views.HomeView.as_view(), name='fe-home'),
    path('home', view=views.HomeView.as_view(), name='fe-home'),
    path('category', view=views.CategoryView.as_view(), name='fe-category'),
]
