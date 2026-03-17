from django.conf import settings
from django.db import models


class SubscriptionTier(models.Model):
	name = models.CharField(max_length=100, unique=True)
	price = models.DecimalField(max_digits=10, decimal_places=2)
	max_usage = models.PositiveIntegerField()

	def __str__(self):
		return self.name


class UserSubscription(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
	tier = models.ForeignKey(SubscriptionTier, on_delete=models.CASCADE, related_name='subscriptions')
	usage_left = models.PositiveIntegerField()
	is_active = models.BooleanField(default=True)
	subscribed_at = models.DateTimeField(auto_now_add=True)
	paypal_subscription_id = models.CharField(max_length=191, blank=True)

	class Meta:
		ordering = ['-subscribed_at']

	def __str__(self):
		return f'{self.user.email} - {self.tier.name}'
