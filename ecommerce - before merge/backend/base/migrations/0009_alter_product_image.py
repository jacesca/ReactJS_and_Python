# Generated by Django 4.1 on 2023-03-16 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_alter_orderitem_order_alter_orderitem_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='placeholder.png', null=True, upload_to=''),
        ),
    ]
