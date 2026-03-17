from django.urls import path

from .views import (
    CreateSubscriptionView,
    CurrentSubscriptionView,
    SubscriptionListView,
    SubscriptionTierListView,
    VerifyPaypalSubscriptionView,
)

urlpatterns = [
    path('tiers/', SubscriptionTierListView.as_view(), name='subscription-tiers'),
    path('subscribe/', CreateSubscriptionView.as_view(), name='subscription-create'),
    path('current/', CurrentSubscriptionView.as_view(), name='subscription-current'),
    path('admin/list/', SubscriptionListView.as_view(), name='subscription-list'),
    path('verify-paypal/', VerifyPaypalSubscriptionView.as_view(), name='subscription-verify-paypal'),
]
