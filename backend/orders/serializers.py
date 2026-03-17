from rest_framework import serializers

from services.serializers import ServiceSerializer

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id',
            'buyer',
            'service',
            'service_id',
            'paypal_transaction_id',
            'price_paid',
            'date_purchased',
        ]
        read_only_fields = ['buyer', 'date_purchased']
