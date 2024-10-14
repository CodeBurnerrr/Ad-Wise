from django.db import models  # Importing models
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Listing
from .serializers import ListingSerializer, ListingDetailSerializer
from datetime import datetime, timezone

class ListingsView(ListAPIView):
    queryset = Listing.objects.order_by('-list_date').filter(is_published=True)
    permission_classes = (permissions.AllowAny,)
    serializer_class = ListingSerializer
    lookup_field = 'slug'

class ListingView(RetrieveAPIView):
    queryset = Listing.objects.order_by('-list_date').filter(is_published=True)
    serializer_class = ListingDetailSerializer
    lookup_field = 'slug'

class SearchView(APIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ListingSerializer

    def post(self, request, format=None):
        data = self.request.data
        print(f"Received data: {data}")  # Print the received data
        
        queryset = Listing.objects.order_by('-list_date').filter(is_published=True)

        # Sale Type
        sale_type = data.get('sale_type')
        queryset = queryset.filter(sale_type__iexact=sale_type)

        print(f"Received data: {queryset}")

        # Home Type
        home_type = data.get('home_type')
        if home_type != 'Any':
            queryset = queryset.filter(home_type__iexact=home_type)
        print(f"Received data: {queryset}")

        # Price
        price = data.get('price')
        
        if price == '₹20,00,000+':
            price = 2000000
        elif price == '₹40,00,000+':
            price = 4000000
        elif price == '₹60,00,000+':
            price = 6000000
        elif price == '₹80,00,000+':
            price = 8000000
        elif price == '₹1,00,00,000+':
            price = 10000000
        elif price == '₹1,20,00,000+':
            price = 12000000
        elif price == '₹1,50,00,000+':
            price = 15000000
        elif price == 'Any':
            price = -1

        if price != -1:
            queryset = queryset.filter(price__gte=price)

        print(f"Received data: {queryset}")

        # Bed Rooms
        bedrooms = data.get('bedrooms')
        if bedrooms == 'Any':
            bedrooms = 0
        elif bedrooms == '1+':
            bedrooms = 1
        elif bedrooms == '2+':
            bedrooms = 2
        elif bedrooms == '3+':
            bedrooms = 3
        elif bedrooms == '4+':
            bedrooms = 4
        elif bedrooms == '5+':
            bedrooms = 5

        if bedrooms != 0:
            queryset = queryset.filter(bedrooms__gte=bedrooms)

        print(f"Received data: {queryset}")

        # Bath Rooms
        bathrooms = data.get('bathrooms')
        if bathrooms == 'Any':
            bathrooms = 0
        elif bathrooms == '1+':
            bathrooms = 1.0
        elif bathrooms == '2+':
            bathrooms = 2.0
        elif bathrooms == '3+':
            bathrooms = 3.0
        elif bathrooms == '4+':
            bathrooms = 4.0


        if bathrooms != 0:
            queryset = queryset.filter(bathrooms__gte=bathrooms)

        print(f"Received data: {queryset}")

        # Size in SQFT
        sqft = data.get('sqft')
        if sqft == '1000+':
            sqft = 1000
        elif sqft == '1200+':
            sqft = 1200
        elif sqft == '1500+':
            sqft = 1500
        elif sqft == '2000+':
            sqft = 2000
        elif sqft == 'Any':
            sqft = 0

        if sqft != 0:
            queryset = queryset.filter(sqft__gte=sqft)

        print(f"Received data: {queryset}")

        # Days Past after Published
        days_passed = data.get('days_listed')
        if days_passed == 'Any':
            days_passed = 0
        elif days_passed == '1 or less':
            days_passed = 1
        elif days_passed == '2 or less':
            days_passed = 2
        elif days_passed == '5 or less':
            days_passed = 5
        elif days_passed == '10 or less':
            days_passed = 10
        elif days_passed == '20 or less':
            days_passed = 20

        for query in queryset:
            num_days = (datetime.now(timezone.utc) - query.list_date).days
            if days_passed != 0:
                if num_days > days_passed:
                    slug = query.slug
                    queryset = queryset.exclude(slug__iexact=slug)

        print(f"Received data: {queryset}")

        # Photos
        has_photos = data.get('has_photos')
        if has_photos == '1+':
            has_photos = 1
        elif has_photos == '3+':
            has_photos = 3
        elif has_photos == '5+':
            has_photos = 5

        for query in queryset:
            count = 0
            if query.photo_1:
                count += 1
            if query.photo_2:
                count += 1
            if query.photo_3:
                count += 1
            if query.photo_4:
                count += 1
            if query.photo_5:
                count += 1
            if query.photo_6:
                count += 1
            if query.photo_7:
                count += 1
            if query.photo_8:
                count += 1
            if query.photo_9:
                count += 1
            if query.photo_10:
                count += 1

            if count < has_photos:
                slug = query.slug
                queryset = queryset.exclude(slug__iexact=slug)

        print(f"Received data: {queryset}")

        # House should be Open True
        # open_house = True
        # queryset = queryset.filter(open_house__iexact=open_house)
        # print(f"Received data: {queryset}")

        # Keywords
        keywords = data.get('keywords')
        queryset = queryset.filter(description__icontains=keywords)
        print(f"Received data: {queryset}")


        print(f"Filtered data: {queryset}")

        

        serializer = ListingSerializer(queryset, many=True)
        data = serializer.data
        print(data)

        for i in data:
            path = i['photo_main']
            newpath = 'http://localhost:8000'+path 
            i['photo_main'] = newpath

        return Response(data)
