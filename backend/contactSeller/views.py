from rest_framework import permissions
from rest_framework.views import APIView
from .models import Contact
from django.core.mail import send_mail
from rest_framework.response import Response


class ContactCreateView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data
        print(data)
        print("Name: " + data['seller_email'])
        response = 'You will be contacted shortly.'

        try:
            send_mail(
                data['subject'],
                f"Dear {data['name']},\n\nThank you for reaching out to AD WISE. "
                "We have received your message and forwarded it to our relator. "
                "They will get in touch with you shortly to assist you further.\n\n"
                "In the meantime, if you have any additional questions or information you'd like to provide, "
                "feel free to reply to this email.\n\n"
                "Thank you for choosing AD WISE. We are here to help you with your house advertising needs.\n\n"
                "Best regards,\nThe AD WISE Team\n",
                'AdWise@gmail.com',
                [data['email']],
                fail_silently=False 
            )           



            send_mail(
                'New Inquiry from a Customer',
                f"Dear Relator,\n\n"
                "You have received a new inquiry from a potential customer regarding your listing. Here are the details:\n\n"
                f"Name: {data['name']}\n"
                f"Email: {data['email']}\n"
                f"Message:\n{data['message']}\n\n"
                "Please reach out to the customer at your earliest convenience to discuss their inquiry.\n\n"
                "Best regards,\nThe AD WISE Team\n",
                'AdWise@gmail.com',
                [data['seller_email']],
                fail_silently=False
            )

            


            contact = Contact(name=data['name'],
                              email=data['email'],
                              seller_email=data['seller_email'],
                              subject=data['subject'],
                              message=data['message'])
            contact.save()

            return Response({'success': 'Message sent successfully'})

        except:
            return Response({'error': 'Message failed to send'})