from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    name_of_the_expert = serializers.SerializerMethodField()
    seller_merchant_id = serializers.CharField(source='seller.merchant_id', read_only=True)
    sample_image = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id',
            'seller',
            'service_name',
            'description',
            'price',
            'duration_of_service',
            'sample_image',
            'rating',
            'name_of_the_expert',
            'seller_merchant_id',
            'created_at',
        ]
        read_only_fields = ['seller', 'rating', 'created_at']

    def get_name_of_the_expert(self, obj):
        return f'{obj.seller.first_name} {obj.seller.last_name}'.strip() or obj.seller.username

    def get_sample_image(self, obj):
        request = self.context.get('request')
        if obj.sample_image and hasattr(obj.sample_image, 'url'):
            if request:
                return request.build_absolute_uri(obj.sample_image.url)
            return obj.sample_image.url
        return ''
