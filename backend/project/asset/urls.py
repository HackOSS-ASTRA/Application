from django.urls import path
from asset.views import AssetDetailsView, AssetHistoryView

urlpatterns = [
    path('details/', AssetDetailsView.as_view()),
    path('history/', AssetHistoryView.as_view()),
]