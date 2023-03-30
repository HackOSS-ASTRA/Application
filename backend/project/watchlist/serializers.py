from rest_framework import serializers
from watchlist.models import WatchlistItem

class UserWatchlistSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    close_price = serializers.FloatField(source='asset.close_price', read_only=True)
    currency = serializers.CharField(source='asset.currency', read_only=True)
    primary_exchange = serializers.CharField(source='asset.primary_exchange', read_only=True)
    class Meta:
        model = WatchlistItem
        fields = ['id', 'user', 'asset', 'asset_name', 'close_price', 'currency', 'primary_exchange']
