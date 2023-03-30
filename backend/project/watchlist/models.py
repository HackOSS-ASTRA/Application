from django.db import models
from django.contrib.auth.models import User
from asset.models import Asset

class WatchlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    def __str__(self):
        return f'{self.user.username} | {self.asset.asset_id}'