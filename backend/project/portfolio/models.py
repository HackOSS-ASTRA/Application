from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator
from asset.models import Asset
    
class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cash_balance = models.FloatField(validators=[MinValueValidator(0)], default=0)
    net_worth = models.FloatField(validators=[MinValueValidator(0)], default=0)
    def __str__(self):
        return f'{self.user.username} | ${self.net_worth}'
@receiver(post_save, sender=User)
def create_user_portfolio(sender, instance, created, **kwargs):
    if created:
        Portfolio.objects.create(user=instance)
@receiver(post_save, sender=User)
def save_user_portfolio(sender, instance, **kwargs):
    instance.portfolio.save()

class PortfolioItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='portfolio_item')
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)], default=0)
    average_cost = models.FloatField(validators=[MinValueValidator(0)], default=0)
    total_cost = models.FloatField(validators=[MinValueValidator(0)], default=0)
    current_value = models.FloatField(validators=[MinValueValidator(0)], default=0)
    def __str__(self):
        return f'{self.user.username} | {self.asset.asset_id} | {self.total_cost}'

class TransactionItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='transaction_item')
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, blank=True, null=True)
    transaction_type = models.CharField(max_length=10, choices=[('Buy', 'Buy'), ('Sell', 'Sell'), ('Deposit', 'Deposit'), ('Withdrawal', 'Withdrawal')])
    transaction_price = models.FloatField(validators=[MinValueValidator(0)])
    quantity = models.IntegerField(validators=[MinValueValidator(1)], blank=True, null=True)
    total_cost = models.FloatField(validators=[MinValueValidator(0)])
    transaction_date = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return f'{self.user.username} | {"Cash" if self.asset == None else self.asset.asset_id} | {self.transaction_type} | {self.total_cost} | {self.transaction_date}'
