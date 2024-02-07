from django.urls import path
from . import views

app_name = 'authen'

urlpatterns = [
    path('api/authen/login', view=views.AuthenAPI.Login.as_view(), name='login'),
    path('api/authen/me', view=views.AuthenAPI.Me.as_view(), name='me'),
    path('api/authen/refresh-token', view=views.AuthenAPI.RefreshToken.as_view(), name='refresh-token'),
    path('api/authen/register', view=views.AuthenAPI.Register.as_view(), name='register'),
    path('api/authen/missing-password', view=views.AuthenAPI.MissingPassword.as_view(), name='missing-password'),
    path('api/authen/logout', view=views.AuthenAPI.Logout.as_view(), name='logout'),
]
