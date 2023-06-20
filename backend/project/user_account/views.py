from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from user_account.serializers import UserSerializer, ProfileSerializer

class AccountDetailsView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        profile = self.request.user.profile
        user_details = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'mobile_number': profile.mobile_number,
            'date_of_birth': profile.date_of_birth,
            'date_joined': profile.date_joined,
        }
        return Response(user_details)

class AccountUpdateView(generics.CreateAPIView):
    queryset = User.objects.all()
    def post(self, request, *args, **kwargs):
        data = self.request.data
        user_serializer = UserSerializer(instance=self.request.user, data=data)
        profile_serializer = ProfileSerializer(instance=self.request.user.profile, data=data)
        if user_serializer.is_valid(raise_exception=True) and profile_serializer.is_valid(raise_exception=True):
            user_serializer.update(instance=self.request.user, validated_data=data)
            profile_serializer.update(instance=self.request.user.profile, validated_data=data)
            return Response({'success': 'account updated successfully'}, status.HTTP_202_ACCEPTED)
        return Response({'error': f'{[user_serializer.errors, profile_serializer.errors]}'}, status.HTTP_406_NOT_ACCEPTABLE)
