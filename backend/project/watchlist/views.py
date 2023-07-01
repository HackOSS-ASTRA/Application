from rest_framework import generics, status
from rest_framework.response import Response
from watchlist.models import WatchlistItem
from watchlist.serializers import UserWatchlistSerializer

class UserWatchlistView(generics.ListCreateAPIView):
    queryset = WatchlistItem.objects.all()
    serializer_class = UserWatchlistSerializer
    def get_queryset(self):
        user_id = self.request.user.id
        self.queryset = self.queryset.filter(user=user_id)
        return self.queryset
    def post(self, request, *args, **kwargs):
        data = request.data
        user_id = self.request.user.id
        asset_id = data.get('asset')
        if WatchlistItem.objects.filter(user=user_id, asset=asset_id):
            return Response({'error': 'asset already exists in your watchlist'}, status.HTTP_406_NOT_ACCEPTABLE)
        else:
            data['user'] = user_id
            return super().post(request, *args, **kwargs)

class DeleteWatchlistItemView(generics.DestroyAPIView):
    queryset = WatchlistItem.objects.all()
    def destroy(self, request, *args, **kwargs):
        try:
            item = WatchlistItem.objects.get(user=self.request.user, asset=self.kwargs['pk'])
            item.delete()
            return Response({'success': 'asset removed from watchlist'})
        except:
            return Response({'error': 'asset not added to watchlist'}, status.HTTP_400_BAD_REQUEST)
