from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
	list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'merchant_id')
	list_filter = ('role', 'gender', 'is_staff', 'is_superuser')
	ordering = ('email',)
	fieldsets = UserAdmin.fieldsets + (
		(
			'Additional Info',
			{'fields': ('phone_number', 'location', 'gender', 'role', 'merchant_id')},
		),
	)
	add_fieldsets = UserAdmin.add_fieldsets + (
		(
			'Additional Info',
			{'fields': ('email', 'phone_number', 'location', 'gender', 'role', 'merchant_id')},
		),
	)
