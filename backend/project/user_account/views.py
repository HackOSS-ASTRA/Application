from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from user_account.serializers import UserSerializer, ProfileSerializer

class AccountDetailsView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def get_queryset(self):
        user_id = self.request.user.id
        self.queryset = self.queryset.filter(id=user_id)
        return self.queryset

class AccountUpdateView(generics.CreateAPIView):
    queryset = User.objects.all()
    def post(self, request, *args, **kwargs):
        data = self.request.POST
        user_serializer = UserSerializer(instance=self.request.user, data=data)
        profile_serializer = ProfileSerializer(instance=self.request.user.profile, data=data)
        if user_serializer.is_valid(raise_exception=True) and profile_serializer.is_valid(raise_exception=True):
            user_serializer.update(instance=self.request.user, validated_data=data)
            profile_serializer.update(instance=self.request.user.profile, validated_data=data)
            return Response({'success': 'account updated successfully'}, status.HTTP_202_ACCEPTED)
        return Response({'error': f'{[user_serializer.errors, profile_serializer.errors]}'}, status.HTTP_406_NOT_ACCEPTABLE)
