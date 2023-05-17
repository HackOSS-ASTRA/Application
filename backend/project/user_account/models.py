from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import RegexValidator

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_photo = models.ImageField(blank=True, null=True)
    mobile_number = models.CharField(max_length=20, validators=[RegexValidator('^\+[0-9]{7,20}$')])
    date_of_birth = models.DateField(blank=True, null=True)
    date_joined = models.DateField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} | {self.user.first_name} {self.user.last_name}'
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
