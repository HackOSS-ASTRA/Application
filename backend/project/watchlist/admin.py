from django.contrib import admin
from watchlist.models import WatchlistItem

# Register your models here.
admin.site.register([
    WatchlistItem,
])
