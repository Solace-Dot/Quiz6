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


class UserOrderHistoryView(generics.ListAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Order.objects.select_related('service', 'service__seller').filter(buyer=self.request.user)
