from django.urls import path
from user_account import views

urlpatterns = [
    path('details/', views.AccountDetailsView.as_view()),
    path('update/', views.AccountUpdateView.as_view()),
]