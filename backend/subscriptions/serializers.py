from rest_framework import serializers

from .models import SubscriptionTier, UserSubscription


class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = ['id', 'name', 'price', 'max_usage']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    tier = SubscriptionTierSerializer(read_only=True)
    tier_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = UserSubscription
        fields = [
            'id',
            'user',
            'tier',
            'tier_id',
            'usage_left',
            'is_active',
            'subscribed_at',
            'paypal_subscription_id',
        ]
