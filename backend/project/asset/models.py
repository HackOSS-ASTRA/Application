from django.db import models
from timescale.db.models.models import TimescaleModel
from django.core.validators import MinValueValidator

class Asset(models.Model):
    active = models.BooleanField(default=True)
    asset_id = models.CharField(max_length=50)
    asset_name = models.CharField(max_length=200)
    asset_type = models.CharField(max_length=50, blank=True, null=True)
    primary_exchange = models.CharField(max_length=50, blank=True, null=True)
    price_date = models.DateTimeField(blank=True, null=True)
    open_price = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    close_price = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    low_price = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    high_price = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    adjusted_close_price = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    volume = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    currency = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f'{self.asset_id} | ${self.close_price}'
    
class AssetHistory(TimescaleModel):
    asset_id = models.CharField(max_length=50)
    open_price = models.FloatField(validators=[MinValueValidator(0)])
    close_price = models.FloatField(validators=[MinValueValidator(0)])
    low_price = models.FloatField(validators=[MinValueValidator(0)])
    high_price = models.FloatField(validators=[MinValueValidator(0)])
    adjusted_close_price = models.FloatField(validators=[MinValueValidator(0)], blank=True, null=True)
    volume = models.FloatField(validators=[MinValueValidator(0)])

    def __str__(self):
        return f'{self.time} | {self.asset_id} | ${self.close_price}'
