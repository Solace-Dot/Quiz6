import requests
from django.conf import settings
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


class VerifyPaypalSubscriptionView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		subscription_id = request.data.get('subscription_id', '').strip()
		if not subscription_id:
			raise serializers.ValidationError({'subscription_id': 'Subscription ID is required.'})

		if not settings.PAYPAL_CLIENT_ID or not settings.PAYPAL_SECRET:
			return Response({'detail': 'PayPal server credentials are not configured.'}, status=status.HTTP_400_BAD_REQUEST)

		base = 'https://api-m.sandbox.paypal.com'
		try:
			token_response = requests.post(
				f'{base}/v1/oauth2/token',
				auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET),
				data={'grant_type': 'client_credentials'},
				headers={'Accept': 'application/json', 'Accept-Language': 'en_US'},
				timeout=15,
			)
			token_response.raise_for_status()
			access_token = token_response.json()['access_token']

			subscription_response = requests.get(
				f'{base}/v1/billing/subscriptions/{subscription_id}',
				headers={'Authorization': f'Bearer {access_token}'},
				timeout=15,
			)
			subscription_response.raise_for_status()
			subscription_data = subscription_response.json()
		except requests.RequestException:
			return Response({'detail': 'Could not verify PayPal subscription at this time.'}, status=status.HTTP_502_BAD_GATEWAY)

		return Response({'status': subscription_data.get('status'), 'subscription': subscription_data})
