from rest_framework import serializers
from django.contrib.auth.models import User
from user_account.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['mobile_number', 'date_of_birth', 'date_joined']
        read_only_fields = ['date_joined']

class UserSerializer(serializers.ModelSerializer):
    mobile_number = serializers.CharField(source='profile.mobile_number')
    date_of_birth = serializers.DateField(source='profile.date_of_birth')
    date_joined = serializers.DateField(source='profile.date_joined', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'mobile_number', 'date_of_birth', 'date_joined']
        read_only_fields = ['id', 'username']
