from rest_framework import generics, status
from rest_framework.response import Response
from asset.serializers import AssetSerializer, AssetHistorySerializer
from asset.models import Asset, AssetHistory
from rest_framework.permissions import AllowAny
from portfolio.models import PortfolioItem

class AssetDetailsView(generics.ListCreateAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = (AllowAny, )
    def get_queryset(self):
        data = self.request.GET
        asset_id_exact, asset_name_exact, asset_type_exact = data.get('asset_id_exact'), data.get('asset_name_exact'), data.get('asset_type_exact')
        asset_id_contains, asset_name_contains, asset_type_contains = data.get('asset_id_contains'), data.get('asset_name_contains'), data.get('asset_type_contains')
        if asset_id_exact != None:
            self.queryset = self.queryset.filter(asset_id__iexact=asset_id_exact)
        elif asset_id_contains != None:
            self.queryset = self.queryset.filter(asset_id__icontains=asset_id_contains)
        if asset_name_exact != None:
            self.queryset = self.queryset.filter(asset_name__iexact=asset_name_exact)
        elif asset_name_contains != None:
            self.queryset = self.queryset.filter(asset_name__icontains=asset_name_contains)
        if asset_type_exact != None:
            self.queryset = self.queryset.filter(asset_type__iexact=asset_type_exact)
        elif asset_type_contains != None:
            self.queryset = self.queryset.filter(asset_type__icontains=asset_type_contains)
        return self.queryset
    def post(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            data = self.request.POST
            data._mutable = True
            data['active'] = True
            data._mutable = False
            return super().post(request, *args, **kwargs)
        else:
            return Response({'error': 'you are not authorised to add new stocks'}, status.HTTP_401_UNAUTHORIZED)

class UpdateAssetDetailsView(generics.UpdateAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    def put(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            data = self.request.data
            asset_serializer = AssetSerializer(data=data)
            if asset_serializer.is_valid(raise_exception=True):
                asset = Asset.objects.get(id=self.kwargs['pk'])
                asset.active = data.get('active')
                asset.asset_name = data.get('asset_name')
                asset.asset_type = data.get('asset_type')
                asset.primary_exchange = data.get('primary_exchange')
                asset.price_date = data.get('price_date')
                asset.open_price = data.get('open_price')
                asset.close_price = data.get('close_price')
                asset.low_price = data.get('low_price')
                asset.high_price = data.get('high_price')
                asset.adjusted_close_price = data.get('adjusted_close_price')
                asset.volume = data.get('volume')
                asset.currency = data.get('currency')
                asset.save()
                port_items = PortfolioItem.objects.filter(asset=asset).all()
                for port_item in port_items:
                    old_value = port_item.current_value
                    port_item.current_value = float(port_item.asset.close_price) * float(port_item.quantity)
                    port_item.portfolio.net_worth += (port_item.current_value - old_value)
                    port_item.save()
                    port_item.portfolio.save()
                return Response({'success': 'asset updated successfully'}, status.HTTP_200_OK)
            return Response({'error': asset_serializer.errors}, status.HTTP_200_OK)
        return Response({'error': 'you are not authorised to edit stock data'}, status.HTTP_401_UNAUTHORIZED)
class AssetHistoryView(generics.ListCreateAPIView):
    queryset = AssetHistory.objects.all()
    serializer_class = AssetHistorySerializer
    permission_classes = (AllowAny, )
    def get_queryset(self):
        data = self.request.GET
        asset_id, time = data.get('asset_id'), data.get('time')
        if asset_id != None:
            self.queryset = self.queryset.filter(asset_id=asset_id)
        if time != None:
            self.queryset = self.queryset.filter(time__icontains=time)
        return self.queryset
    def post(self, request, *args, **kwargs):
        user = self.request.user
        print(user.is_superuser, user.is_staff)
        if user.is_superuser or user.is_staff:
            return super().post(request, *args, **kwargs)
        else:
            return Response({'error': 'you are not authorised to add new stocks'}, status.HTTP_401_UNAUTHORIZED)