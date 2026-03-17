from django.contrib import admin

from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ('buyer', 'service', 'paypal_transaction_id', 'price_paid', 'date_purchased')
	search_fields = ('buyer__email', 'service__service_name', 'paypal_transaction_id')
