from rest_framework import serializers
from asset.models import Asset, AssetHistory

class AssetSerializer(serializers.ModelSerializer):
    asset = serializers.CharField(source='id', read_only=True)
    class Meta:
        model = Asset
        fields = [
            'id',
            'active',
            'asset',
            'asset_id',
            'asset_name',
            'asset_type',
            'primary_exchange',
            'price_date',
            'open_price',
            'close_price',
            'low_price',
            'high_price',
            'adjusted_close_price',
            'volume',
            'currency',
            'change_proportion',
            'change_amount',
        ]

class AssetHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetHistory
        fields = '__all__'
