from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def ensure_default_tiers(sender, **kwargs):
    if sender.name != 'subscriptions':
        return

    from .models import SubscriptionTier

    defaults = [
        ('Tier 1', '19.99', 3),
        ('Tier 2', '39.99', 5),
        ('Tier 3', '69.99', 10),
    ]
    for name, price, max_usage in defaults:
        SubscriptionTier.objects.get_or_create(
            name=name,
            defaults={'price': price, 'max_usage': max_usage},
        )
