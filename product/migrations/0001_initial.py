# Generated by Django 4.0 on 2024-01-24 15:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('catalog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(db_column='name', max_length=255)),
                ('author', models.CharField(db_column='author', max_length=255)),
                ('publish_date', models.DateField(db_column='publish_date')),
                ('description', models.CharField(db_column='description', max_length=500, null=True)),
                ('image', models.CharField(db_column='image', max_length=255)),
                ('category', models.ForeignKey(db_column='id_category', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='product', to='catalog.category')),
            ],
            options={
                'db_table': 'product',
                'managed': True,
            },
        ),
    ]
