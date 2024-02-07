from django.db import models

from catalog.models import Category


# Create your models here.


class Product(models.Model):
    class Meta:
        db_table = 'product'
        managed = True

    id = models.AutoField(primary_key=True, db_column='id', unique=True)
    name = models.CharField(max_length=255, db_column='name', null=False)
    author = models.CharField(max_length=255, db_column='author', null=False)
    publish_date = models.DateField(db_column='publish_date', null=False)
    description = models.CharField(max_length=500, db_column='description', null=True)
    price = models.IntegerField(db_column='price', null=False, default=20000)
    image = models.CharField(max_length=255, db_column='image', null=False)
    quantity = models.IntegerField(db_column='quantity', null=False, default=0)
    category = models.ForeignKey(Category, db_column='id_category', related_name='product', on_delete=models.CASCADE, null=True)
