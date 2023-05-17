from django.urls import path
from asset.views import AssetDetailsView, AssetHistoryView, UpdateAssetDetailsView

urlpatterns = [
    path('details/', AssetDetailsView.as_view()),
    path('details/<int:pk>/', UpdateAssetDetailsView.as_view()),
    path('history/', AssetHistoryView.as_view()),
] 
