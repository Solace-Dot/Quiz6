from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .permissions import IsAdminRole
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer


class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = RegisterSerializer
	permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_object(self):
		return self.request.user


class AdminUserListView(generics.ListAPIView):
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated, IsAdminRole]
	queryset = CustomUser.objects.all().order_by('first_name', 'last_name', 'email')


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated, IsAdminRole]
	queryset = CustomUser.objects.all()

	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data, status=status.HTTP_200_OK)
