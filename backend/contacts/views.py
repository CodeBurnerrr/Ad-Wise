from rest_framework import permissions
from rest_framework.views import APIView
from .models import Contact
from django.core.mail import send_mail
from rest_framework.response import Response


class ContactCreateView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        response = 'You will be contacted shortly.'

        try:
            send_mail(
            data['subject'], 
            f"Dear {data['name']},\n\nThank you for contacting AD WISE!\n\n"
            "We have received your message regarding house advertising, and our team is reviewing it. "
            "One of our representatives will get back to you as soon as possible.\n\n"
            "If you have any additional questions or information you'd like to share, "
            "feel free to reply to this email.\n\n"
            "Thank you for choosing AD WISE.\n\n"
            "Best regards,\nThe AD WISE Team\n",
            'AdWise@gmail.com',
            [data['email']],
            fail_silently=False
)


            contact = Contact(name=data['name'],
                              email=data['email'],
                              subject=data['subject'],
                              message=data['message'])
            contact.save()

            return Response({'success': 'Message sent successfully'})

        except:
            return Response({'error': 'Message failed to send'})