# Generated by Django 4.1 on 2023-03-10 22:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_shippingaddress_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='placeholder.png', null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='shippingaddress',
            name='order',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shippingAddresses', to='base.order'),
        ),
    ]
