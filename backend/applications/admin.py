from django.contrib import admin

from .models import SellerApplication


@admin.register(SellerApplication)
class SellerApplicationAdmin(admin.ModelAdmin):
	list_display = ('user', 'status', 'created_at')
	search_fields = ('user__email', 'user__username', 'user__first_name', 'user__last_name')
	list_filter = ('status',)
