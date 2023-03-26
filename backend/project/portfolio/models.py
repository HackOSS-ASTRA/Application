from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from asset.models import Asset
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class PortfolioItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    average_cost = models.FloatField(validators=[MinValueValidator(0)])
    total_cost = models.FloatField(validators=[MinValueValidator(0)])


    def __str__(self):
        return f'{self.user.username} | {self.asset.asset_id} | {self.total_cost}'


class TransactionItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    total_cost = models.FloatField(validators=[MinValueValidator(0)])
    transaction_date = models.DateTimeField(default=timezone.now)


class Portfolio(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    assets = models.ManyToManyField(PortfolioItem, blank=True)
    transactions = models.ManyToManyField(TransactionItem, blank=True)
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
