from rest_framework import serializers
from portfolio.models import Portfolio, PortfolioItem, TransactionItem

class DepositWithdrawSerializer(serializers.Serializer):
    amount = serializers.FloatField()

class BuySellSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(source='asset.asset_id', read_only=True)
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    asset_type = serializers.CharField(source='asset.asset_type', read_only=True)
    primary_exchange = serializers.CharField(source='asset.primary_exchange', read_only=True)
    price_date = serializers.DateTimeField(source='asset.price_date', read_only=True)
    open_price = serializers.FloatField(source='asset.open_price', read_only=True)
    close_price = serializers.FloatField(source='asset.close_price', read_only=True)
    low_price = serializers.FloatField(source='asset.low_price', read_only=True)
    high_price = serializers.FloatField(source='asset.high_price', read_only=True)
    adjusted_close_price = serializers.FloatField(source='asset.adjusted_close_price', read_only=True)
    volume = serializers.FloatField(source='asset.volume', read_only=True)
    currency = serializers.CharField(source='asset.currency', read_only=True)
    change_proportion = serializers.FloatField(source='asset.change_proportion', read_only=True)
    change_amount = serializers.FloatField(source='asset.change_amount', read_only=True)
    
    class Meta:
        model = PortfolioItem
        fields = [
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
            'quantity',
        ]

class PortfolioItemSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(source='asset.asset_id', read_only=True)
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    asset_type = serializers.CharField(source='asset.asset_type', read_only=True)
    primary_exchange = serializers.CharField(source='asset.primary_exchange', read_only=True)
    currency = serializers.CharField(source='asset.currency', read_only=True)
    price_date = serializers.DateTimeField(source='asset.price_date', read_only=True)
    open_price = serializers.FloatField(source='asset.open_price', read_only=True)
    close_price = serializers.FloatField(source='asset.close_price', read_only=True)
    low_price = serializers.FloatField(source='asset.low_price', read_only=True)
    high_price = serializers.FloatField(source='asset.high_price', read_only=True)
    adjusted_close_price = serializers.FloatField(source='asset.adjusted_close_price', read_only=True)
    volume = serializers.FloatField(source='asset.volume', read_only=True)
    change_proportion = serializers.FloatField(source='asset.change_proportion', read_only=True)
    change_amount = serializers.FloatField(source='asset.change_amount', read_only=True)

    class Meta:
        model = PortfolioItem
        fields = [
            'asset',
            'asset_id',
            'asset_name',
            'asset_type',
            'primary_exchange',
            'currency',
            'quantity',
            'total_cost',
            'average_cost',
            'current_value',
            'price_date',
            'open_price',
            'close_price',
            'low_price',
            'high_price',
            'adjusted_close_price',
            'volume',
            'change_proportion',
            'change_amount',
        ]

class TransactionItemSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(source='asset.asset_id', read_only=True)
    asset_name = serializers.CharField(source='asset.asset_name', read_only=True)
    asset_type = serializers.CharField(source='asset.asset_type', read_only=True)
    primary_exchange = serializers.CharField(source='asset.primary_exchange', read_only=True)
    currency = serializers.CharField(source='asset.currency', read_only=True)

    class Meta:
        model = TransactionItem
        fields = ['asset', 'asset_id', 'asset_name', 'asset_type', 'primary_exchange', 'currency', 'transaction_type', 'transaction_price', 'quantity', 'total_cost', 'transaction_date']

class UserPortfolioSerializer(serializers.ModelSerializer):
    portfolio_item = PortfolioItemSerializer(read_only=True, many=True)
    transaction_item = TransactionItemSerializer(read_only=True, many=True)

    class Meta:
        model = Portfolio
        fields = ['user', 'cash_balance', 'net_worth', 'portfolio_item', 'transaction_item']
