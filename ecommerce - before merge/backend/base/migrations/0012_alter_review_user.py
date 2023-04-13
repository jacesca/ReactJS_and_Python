# Generated by Django 4.1 on 2023-03-20 23:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("base", "0011_alter_review_product_alter_review_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="review",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="reviews",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
