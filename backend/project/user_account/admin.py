from django.contrib import admin
from user_account.models import Profile

# Register your models here.
admin.site.register([
    Profile,
])
