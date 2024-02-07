from django.db import models

# Create your models here.


class CartProduct(models.Model):
    class Meta:
        db_table = 'cart_product'
        managed = True

    id = models.BigAutoField(primary_key=True, db_column='id', unique=True)
    user_id = models.IntegerField(db_column='user_id', null=False, default=0)
    product_id = models.IntegerField(db_column='product_id', null=False, default=0)
    quantity = models.IntegerField(db_column='quantity', null=False, default=0)
    created_at = models.DateTimeField(db_column='created_at', null=False, auto_now_add=True)
    updated_at = models.DateTimeField(db_column='updated_at', null=False, auto_now=True)
