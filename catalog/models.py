from django.db import models

# Create your models here.


class Category(models.Model):
    class Meta:
        db_table = 'category'
        managed = True

    id = models.AutoField(primary_key=True, db_column='id', unique=True)
    title = models.CharField(max_length=255, db_column='title', unique=True)
    description = models.CharField(max_length=500, db_column='description')
    image = models.CharField(max_length=500, db_column='image', default='category_default.jpg', null=False)
