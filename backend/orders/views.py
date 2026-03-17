import requests
from django.conf import settings
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from services.models import Service

from .models import Order
from .serializers import OrderSerializer


class CreateOrderView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		service_id = request.data.get('service')
		paypal_transaction_id = request.data.get('paypal_transaction_id', '').strip()

		if not service_id:
			raise serializers.ValidationError({'service': 'Service is required.'})
		if not paypal_transaction_id:
			raise serializers.ValidationError({'paypal_transaction_id': 'PayPal transaction ID is required.'})

		service = Service.objects.select_related('seller').get(pk=service_id)
		order, created = Order.objects.get_or_create(
			paypal_transaction_id=paypal_transaction_id,
			defaults={
				'buyer': request.user,
				'service': service,
				'price_paid': request.data.get('price_paid') or service.price,
			},
		)

		if not created and order.buyer != request.user:
			return Response({'detail': 'Transaction is already linked to another user.'}, status=status.HTTP_400_BAD_REQUEST)

		return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class VerifyPaypalOrderView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		order_id = request.data.get('order_id', '').strip()
		if not order_id:
			raise serializers.ValidationError({'order_id': 'Order ID is required.'})

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

			order_response = requests.get(
				f'{base}/v2/checkout/orders/{order_id}',
				headers={'Authorization': f'Bearer {access_token}'},
				timeout=15,
			)
			order_response.raise_for_status()
			order_data = order_response.json()
		except requests.RequestException:
			return Response({'detail': 'Could not verify PayPal order at this time.'}, status=status.HTTP_502_BAD_GATEWAY)

		return Response({'status': order_data.get('status'), 'order': order_data})


class UserOrderHistoryView(generics.ListAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Order.objects.select_related('service', 'service__seller').filter(buyer=self.request.user)
