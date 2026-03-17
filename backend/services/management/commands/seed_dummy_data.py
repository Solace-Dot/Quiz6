from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from services.models import Service
from subscriptions.models import SubscriptionTier


class Command(BaseCommand):
    help = 'Seed dummy data with proper naming and case conventions.'

    def handle(self, *args, **options):
        User = get_user_model()

        admin_user, _ = User.objects.get_or_create(
            email='admin@pressurewashpro.local',
            defaults={
                'username': 'admin_local',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            },
        )
        admin_user.set_password('AdminPass123!')
        admin_user.save()

        seller_user, _ = User.objects.get_or_create(
            email='seller@pressurewashpro.local',
            defaults={
                'username': 'seller_local',
                'first_name': 'Marco',
                'last_name': 'Reyes',
                'phone_number': '09171234567',
                'location': 'Plaridel, Bulacan',
                'gender': 'male',
                'role': 'seller',
                'merchant_id': 'DEMO-MERCHANT-001',
            },
        )
        seller_user.set_password('SellerPass123!')
        seller_user.save()

        user_account, _ = User.objects.get_or_create(
            email='user@pressurewashpro.local',
            defaults={
                'username': 'user_local',
                'first_name': 'Andrea',
                'last_name': 'Solis',
                'phone_number': '09938873648',
                'location': '8th Street, Plaridel',
                'gender': 'female',
                'role': 'user',
            },
        )
        user_account.set_password('UserPass123!')
        user_account.save()

        tiers = [
            ('Tier 1', '19.99', 3),
            ('Tier 2', '39.99', 5),
            ('Tier 3', '69.99', 10),
        ]
        for name, price, max_usage in tiers:
            SubscriptionTier.objects.get_or_create(name=name, defaults={'price': price, 'max_usage': max_usage})

        services = [
            {
                'service_name': 'Driveway Deep Pressure Wash',
                'description': 'High-pressure cleaning for driveway slabs with mold and stain removal.',
                'price': '65.00',
                'duration_of_service': '1 to 2 hours',
            },
            {
                'service_name': 'House Exterior Soft Wash',
                'description': 'Low-pressure soft wash for siding, exterior walls, and painted surfaces.',
                'price': '120.00',
                'duration_of_service': '2 to 3 hours',
            },
            {
                'service_name': 'Commercial Frontage Surface Clean',
                'description': 'Routine pressure washing for storefront entrances and commercial walkways.',
                'price': '180.00',
                'duration_of_service': '3 to 4 hours',
            },
        ]

        for item in services:
            Service.objects.get_or_create(seller=seller_user, service_name=item['service_name'], defaults=item)

        self.stdout.write(self.style.SUCCESS('Dummy data seeded successfully.'))
