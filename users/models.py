from django.db import models

# Create your models here.

class User(models.Model):
    class Meta:
        db_table = 'users'
        managed = True

    id = models.AutoField(primary_key=True, db_column='id', unique=True)
    email = models.CharField(max_length=255, unique=True, db_column='email')
    username = models.CharField(max_length=255, db_column='username')
    password = models.CharField(max_length=255, db_column='password')
    phone = models.CharField(max_length=255, db_column='phone')
    address = models.CharField(max_length=255, db_column='address')
    is_admin = models.BooleanField(default=False, db_column='is_admin', null=False)
    avatar = models.CharField(max_length=255, default='default.jpg', db_column='avatar')

    def __str__(self) -> str:
        return self.email


class UserSession(models.Model):
    class Meta:
        db_table = 'user_session'
        managed = True

    access_token = models.CharField(max_length=500, unique=True, db_column='access_token')
    created_at = models.DateTimeField(db_column='created_at', auto_now_add=True)
    updated_at = models.DateTimeField(db_column='updated_at', auto_now=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column='id_user', related_name='session', primary_key=True)

    def __str__(self) -> str:
        return self.access_token
