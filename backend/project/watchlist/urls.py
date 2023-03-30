from django.urls import path
from watchlist import views

urlpatterns = [
    path('get/', views.UserWatchlistView.as_view()),
    path('delete/<int:pk>/', views.DeleteWatchlistItemView.as_view()),
]