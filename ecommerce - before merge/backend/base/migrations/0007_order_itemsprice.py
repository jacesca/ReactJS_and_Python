# Generated by Django 4.1 on 2023-03-11 06:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_alter_product_image_alter_shippingaddress_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='itemsPrice',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]
