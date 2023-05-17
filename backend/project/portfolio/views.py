from rest_framework import generics, status
from rest_framework.response import Response
from portfolio.models import Portfolio, PortfolioItem, TransactionItem
from portfolio.serializers import UserPortfolioSerializer, DepositWithdrawSerializer, BuySellSerializer, TransactionItemSerializer
from asset.models import Asset

class UserPortfolioView(generics.ListAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = UserPortfolioSerializer
    def get_queryset(self):
        user_id = self.request.user.id
        self.queryset = self.queryset.filter(user=user_id)
        return self.queryset

class DepositView(generics.CreateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = UserPortfolioSerializer
    def post(self, request, *args, **kwargs):
        data = self.request.POST
        deposit_serializer = DepositWithdrawSerializer(data=data)
        if deposit_serializer.is_valid(raise_exception=True) and float(data.get('amount')) > 0:
            user = self.request.user
            portfolio = self.request.user.portfolio
            deposit = data.get('amount')
            portfolio.cash_balance += float(deposit)
            portfolio.net_worth += float(deposit)
            portfolio.save()
            TransactionItem.objects.create(
                    user=user,
                    portfolio=portfolio,
                    transaction_type='Deposit',
                    transaction_price=deposit,
                    total_cost=deposit,
                )
            return Response({'success': 'deposit was successful'}, status.HTTP_202_ACCEPTED)
        return Response({'error': 'invalid deposit amount'}, status.HTTP_406_NOT_ACCEPTABLE)

class WithdrawalView(generics.CreateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = UserPortfolioSerializer
    def post(self, request, *args, **kwargs):
        data = self.request.POST
        deposit_serializer = DepositWithdrawSerializer(data=data)
        user = self.request.user
        portfolio = self.request.user.portfolio
        if deposit_serializer.is_valid(raise_exception=True):
            withdrawal = float(data.get('amount'))
            if withdrawal > 0 and withdrawal <= float(portfolio.cash_balance):
                portfolio.cash_balance -= withdrawal
                portfolio.net_worth -= withdrawal
                portfolio.save()

                TransactionItem.objects.create(
                    user=user,
                    portfolio=portfolio,
                    transaction_type='Withdrawal',
                    transaction_price=withdrawal,
                    total_cost=withdrawal,
                )

                return Response({'success': 'withdrawal was successful'}, status.HTTP_202_ACCEPTED)
        return Response({'error': 'invalid withdrawal amount'}, status.HTTP_406_NOT_ACCEPTABLE)

class BuyAssetView(generics.CreateAPIView):
    serializer_class = TransactionItemSerializer
    def post(self, request, *args, **kwargs):
        data = self.request.POST
        buy_serializer = BuySellSerializer(data=data)
        if buy_serializer.is_valid(raise_exception=True):
            user = self.request.user
            portfolio = user.portfolio
            asset_id = data.get('asset')
            try:
                asset = Asset.objects.get(id=asset_id, active=True)
            except:
                return Response({'error': 'this asset is not active at the moment'}, status.HTTP_406_NOT_ACCEPTABLE)
            
            quantity = data.get('quantity')
            current_price = asset.close_price
            total_cost = float(quantity) * float(current_price)

            if float(total_cost) > float(portfolio.cash_balance):
                return Response({'error': 'insufficient balance to purchase assets'}, status.HTTP_406_NOT_ACCEPTABLE)

            try:
                port_item = PortfolioItem.objects.get(user=user, portfolio=portfolio, asset=asset)
            except:
                port_item = PortfolioItem.objects.create(
                    user=user, 
                    portfolio=portfolio, 
                    asset=asset
                    )

            port_item.quantity += int(quantity)
            port_item.total_cost += float(total_cost)
            port_item.average_cost = float(port_item.total_cost) / float(port_item.quantity)
            port_item.current_value = float(port_item.quantity) * float(current_price)
            port_item.save()

            portfolio.cash_balance -= total_cost
            portfolio.save()

            TransactionItem.objects.create(
                user=user,
                portfolio=portfolio,
                asset=asset,
                transaction_type='Buy',
                transaction_price=current_price,
                quantity=quantity,
                total_cost=total_cost,
            )

        return Response({'success': 'purchase successful'}, status.HTTP_202_ACCEPTED)

class SellAssetView(generics.CreateAPIView):
    serializer_class = TransactionItemSerializer
    def post(self, request, *args, **kwargs):
        data = self.request.POST
        sell_serializer = BuySellSerializer(data=data)
        if sell_serializer.is_valid(raise_exception=True):
            asset_id = data.get('asset')
            user = self.request.user
            portfolio = user.portfolio
            try:
                asset = Asset.objects.get(id=asset_id, active=True)
            except:
                return Response({'error': 'this asset is not active at the moment'}, status.HTTP_406_NOT_ACCEPTABLE)
            try:
                port_item = PortfolioItem.objects.get(user=user, portfolio=portfolio, asset=asset)
            except:
                return Response({'error': 'asset not purchased yet'}, status.HTTP_406_NOT_ACCEPTABLE)
            
            quantity = data.get('quantity')
            if int(port_item.quantity) < int(quantity):
                return Response({'error': 'insufficient assets to sell'}, status.HTTP_406_NOT_ACCEPTABLE)
            
            current_price = asset.close_price
            amount_received = float(current_price) * float(quantity)

            if int(port_item.quantity) == int(quantity):
                port_item.delete()
            else:
                port_item.quantity -= int(quantity)
                port_item.total_cost -= float(quantity) * float(port_item.average_cost)
                port_item.current_value = float(port_item.quantity) * float(current_price)
                port_item.save()

            portfolio.cash_balance += amount_received
            portfolio.save()

            TransactionItem.objects.create(
                user=user,
                portfolio=portfolio,
                asset=asset,
                transaction_type='Sell',
                transaction_price=current_price,
                quantity=quantity,
                total_cost=amount_received,
            )

        return Response({'success': 'sell successful'}, status.HTTP_202_ACCEPTED)
