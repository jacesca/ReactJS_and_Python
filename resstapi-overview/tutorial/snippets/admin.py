from django.apps import apps
from django.contrib import admin

# Enable Admin-functionality on all models
app = apps.get_app_config('snippets')

# Register your models here.
for model_name, model in app.models.items():
  admin.site.register(model)