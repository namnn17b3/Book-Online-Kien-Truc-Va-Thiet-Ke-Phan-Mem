# Generated by Django 4.0 on 2024-01-25 07:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_product_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='quantity',
            field=models.IntegerField(db_column='quantity', default=0),
        ),
    ]
