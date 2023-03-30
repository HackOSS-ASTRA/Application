from django.contrib import admin
from asset.models import Asset, AssetHistory

admin.site.register([
    Asset,
    AssetHistory
])
