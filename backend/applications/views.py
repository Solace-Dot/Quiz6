from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdminRole

from .models import SellerApplication
from .serializers import SellerApplicationSerializer


class SubmitApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		user = request.user
		if user.role == 'seller':
			return Response({'detail': 'User is already an approved seller.'}, status=status.HTTP_400_BAD_REQUEST)

		application = SellerApplication.objects.filter(user=user).first()
		if application and application.status == 'pending':
			return Response({'detail': 'There is already a pending seller application.'}, status=status.HTTP_400_BAD_REQUEST)

		if application:
			application.status = 'pending'
			application.decline_reason = ''
			application.save()
		else:
			application = SellerApplication.objects.create(user=user)

		return Response(SellerApplicationSerializer(application).data, status=status.HTTP_201_CREATED)


class ListApplicationView(generics.ListAPIView):
	serializer_class = SellerApplicationSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.role == 'admin':
			return SellerApplication.objects.select_related('user').all()
		return SellerApplication.objects.select_related('user').filter(user=self.request.user)


class ApproveApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated, IsAdminRole]

	def post(self, request, pk):
		merchant_id = request.data.get('merchant_id', '').strip()
		if not merchant_id:
			raise serializers.ValidationError({'merchant_id': 'Merchant ID is required.'})

		application = SellerApplication.objects.select_related('user').get(pk=pk)
		application.status = 'approved'
		application.decline_reason = ''
		application.save()

		user = application.user
		user.role = 'seller'
		user.merchant_id = merchant_id
		user.save()

		return Response(SellerApplicationSerializer(application).data)


class DeclineApplicationView(APIView):
	permission_classes = [permissions.IsAuthenticated, IsAdminRole]

	def post(self, request, pk):
		reason = request.data.get('decline_reason', '').strip()
		if not reason:
			raise serializers.ValidationError({'decline_reason': 'Decline reason is required.'})

		application = SellerApplication.objects.select_related('user').get(pk=pk)
		application.status = 'declined'
		application.decline_reason = reason
		application.save()
		return Response(SellerApplicationSerializer(application).data)
