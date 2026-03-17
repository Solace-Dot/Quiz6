from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

from services.models import Service
from subscriptions.models import UserSubscription


PROJECT_KEYWORDS = {
	'service',
	'services',
	'seller',
	'expert',
	'pressure',
	'washing',
	'driveway',
	'patio',
	'deck',
	'roof',
	'siding',
	'gutter',
	'exterior',
	'soft wash',
	'subscription',
	'price',
	'duration',
	'paypal',
	'order',
	'application',
	'platform',
	'booking',
}


class AIChatbotView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def _fallback_reply(self):
		featured_services = Service.objects.select_related('seller').all()[:3]
		snippets = []
		for service in featured_services:
			snippets.append(
				f"{service.service_name} by {service.seller.first_name or service.seller.username} costs ${service.price} and takes {service.duration_of_service}."
			)

		service_context = ' '.join(snippets) if snippets else 'No services have been published yet.'
		return (
			'This platform connects users with pressure washing experts, lets approved sellers publish wash offerings, '
			'supports PayPal checkout for each service, and uses subscriptions to unlock chatbot usage. '
			f'Current platform examples: {service_context}'
		)

	def post(self, request):
		message = request.data.get('message', '').strip()
		if not message:
			return Response({'detail': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)

		subscription = UserSubscription.objects.select_related('tier').filter(
			user=request.user,
			is_active=True,
		).order_by('-subscribed_at').first()

		if not subscription or subscription.usage_left <= 0:
			return Response({'detail': 'An active subscription with remaining usage is required.'}, status=status.HTTP_403_FORBIDDEN)

		lowered = message.lower()
		if not any(keyword in lowered for keyword in PROJECT_KEYWORDS):
			return Response(
				{
					'reply': 'I can only answer questions about this pressure washing services platform, including wash services, sellers, orders, subscriptions, and payments.',
					'usage_left': subscription.usage_left,
				},
				status=status.HTTP_200_OK,
			)

		subscription.usage_left -= 1
		subscription.save(update_fields=['usage_left'])

		reply = self._fallback_reply()

		if settings.OPENAI_API_KEY:
			try:
				payload = {
					'model': settings.OPENAI_MODEL,
					'messages': [
						{
							'role': 'system',
							'content': (
								'You are an assistant for a pressure washing services marketplace. '
								'Only answer questions related to pressure washing services, sellers, pricing, '
								'durations, subscriptions, order flow, and PayPal checkout.'
							),
						},
						{'role': 'user', 'content': message},
					],
					'temperature': 0.4,
				}
				headers = {
					'Authorization': f'Bearer {settings.OPENAI_API_KEY}',
					'Content-Type': 'application/json',
				}
				ai_response = requests.post(settings.OPENAI_API_URL, json=payload, headers=headers, timeout=15)
				if ai_response.ok:
					response_json = ai_response.json()
					reply = response_json['choices'][0]['message']['content'].strip()
			except Exception:
				# Keep fallback reply when external AI request fails.
				pass

		return Response({'reply': reply, 'usage_left': subscription.usage_left})
