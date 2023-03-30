from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/register/', include('dj_rest_auth.registration.urls')),
    path('api/user_account/', include('user_account.urls')),
    path('api/assets/', include('asset.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/watchlist/', include('watchlist.urls')),
]
