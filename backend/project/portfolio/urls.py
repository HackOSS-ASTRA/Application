from django.urls import path
from portfolio import views

urlpatterns = [
    path('get/', views.UserPortfolioView.as_view()),
    path('buy/', views.BuyAssetView.as_view()),
    path('sell/', views.SellAssetView.as_view()),
    path('deposit/', views.DepositView.as_view()),
    path('withdrawal/', views.WithdrawalView.as_view()),
]