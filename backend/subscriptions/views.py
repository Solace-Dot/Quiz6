from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.permissions import IsAdminRole

from .models import SubscriptionTier, UserSubscription
from .serializers import SubscriptionTierSerializer, UserSubscriptionSerializer


class SubscriptionTierListView(generics.ListAPIView):
	queryset = SubscriptionTier.objects.all().order_by('price')
	serializer_class = SubscriptionTierSerializer
	permission_classes = [permissions.AllowAny]


class CreateSubscriptionView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		tier_id = request.data.get('tier')
		paypal_subscription_id = request.data.get('paypal_subscription_id', '').strip()
		if not tier_id:
			raise serializers.ValidationError({'tier': 'Tier is required.'})

		tier = SubscriptionTier.objects.get(pk=tier_id)
		UserSubscription.objects.filter(user=request.user, is_active=True).update(is_active=False)
		subscription = UserSubscription.objects.create(
			user=request.user,
			tier=tier,
			usage_left=tier.max_usage,
			paypal_subscription_id=paypal_subscription_id,
		)
		return Response(UserSubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)


class CurrentSubscriptionView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		subscription = UserSubscription.objects.select_related('tier').filter(user=request.user, is_active=True).first()
		if not subscription:
			return Response(None, status=status.HTTP_200_OK)
		return Response(UserSubscriptionSerializer(subscription).data)


class SubscriptionListView(generics.ListAPIView):
	serializer_class = UserSubscriptionSerializer
	permission_classes = [permissions.IsAuthenticated, IsAdminRole]
	queryset = UserSubscription.objects.select_related('user', 'tier').all()
