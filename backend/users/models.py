from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
	GENDER_CHOICES = [
		('male', 'Male'),
		('female', 'Female'),
		('other', 'Other'),
		('prefer_not_to_say', 'Prefer not to say'),
	]
	ROLE_CHOICES = [
		('admin', 'Admin'),
		('seller', 'Seller'),
		('user', 'User'),
	]

	email = models.EmailField(unique=True)
	phone_number = models.CharField(max_length=20, blank=True)
	location = models.CharField(max_length=255, blank=True)
	gender = models.CharField(max_length=32, choices=GENDER_CHOICES, blank=True)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
	merchant_id = models.CharField(max_length=128, blank=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def save(self, *args, **kwargs):
		if self.is_superuser:
			self.role = 'admin'
		super().save(*args, **kwargs)

	def __str__(self):
		return self.email
