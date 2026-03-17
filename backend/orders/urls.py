from django.urls import path

from .views import CreateOrderView, UserOrderHistoryView, VerifyPaypalOrderView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('history/', UserOrderHistoryView.as_view(), name='order-history'),
    path('verify-paypal/', VerifyPaypalOrderView.as_view(), name='order-verify-paypal'),
]
