from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from asset.models import Asset


# Create your models here.
class Watchlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    assets = models.ManyToManyField(Asset, blank=True)


    def __str__(self):
        return f"{self.user.username} | {self.user.first_name} {self.user.last_name}"


@receiver(post_save, sender=User)
def create_user_watchlist(sender, instance, created, **kwargs):
    if created:
        Watchlist.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_watchlist(sender, instance, **kwargs):
    instance.watchlist.save()
