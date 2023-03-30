from rest_framework import serializers
from portfolio.models import Portfolio, PortfolioItem, TransactionItem

class DepositWithdrawSerializer(serializers.Serializer):
    amount = serializers.FloatField()

class BuySellSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['asset', 'quantity']

class PortfolioItemSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(source='asset.asset_id', read_only=True)
    class Meta:
        model = PortfolioItem
        fields = ['asset', 'asset_id', 'quantity', 'total_cost', 'average_cost', 'current_value']

class TransactionItemSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(source='asset.asset_id', read_only=True)
    class Meta:
        model = TransactionItem
        fields = ['asset', 'asset_id', 'transaction_type', 'transaction_price', 'quantity', 'total_cost', 'transaction_date']

class UserPortfolioSerializer(serializers.ModelSerializer):
    portfolio_item = PortfolioItemSerializer(read_only=True, many=True)
    transaction_item = TransactionItemSerializer(read_only=True, many=True)
    class Meta:
        model = Portfolio
        fields = ['user', 'cash_balance', 'net_worth', 'portfolio_item', 'transaction_item']
