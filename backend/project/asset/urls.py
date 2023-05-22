from django.urls import path
from asset.views import AssetDetailsView, AssetHistoryView, UpdateAssetDetailsView, MostTradedView, TopRisers, TopFallers

urlpatterns = [
    path('details/', AssetDetailsView.as_view()),
    path('details/<int:pk>/', UpdateAssetDetailsView.as_view()),
    path('history/', AssetHistoryView.as_view()),
    path('most_traded/', MostTradedView.as_view()),
    path('top_risers/', TopRisers.as_view()),
    path('top_fallers/', TopFallers.as_view()),
]