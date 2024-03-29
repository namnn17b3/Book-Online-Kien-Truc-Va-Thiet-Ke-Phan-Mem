# Generated by Django 4.0 on 2024-02-02 13:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CartProduct',
            fields=[
                ('id', models.BigAutoField(db_column='id', primary_key=True, serialize=False, unique=True)),
                ('user_id', models.IntegerField(db_column='user_id', default=0)),
                ('product_id', models.IntegerField(db_column='product_id', default=0)),
                ('quantity', models.IntegerField(db_column='quantity', default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, db_column='updated_at')),
            ],
            options={
                'db_table': 'cart_product',
                'managed': True,
            },
        ),
    ]
