from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from restaurant.serializer import RestaurantSerializer
from rest_framework.response import Response
from restaurant.models import Restaurant
from accounts.models import User
from accounts.utils import follow_restaurant
from rest_framework import status
from django.shortcuts import get_object_or_404



class FollowRestaurant(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, restaurant_id, format=None):
        restaurant = get_object_or_404(Restaurant, id = restaurant_id)
        user = User.objects.get(id = request.user.id)
        data_follow = request.data.get('follow', None)
        follow = None
        if data_follow == 1:
            follow = True
        elif data_follow == 0:
            follow = False
        else:
            return Response({"follow": ["Should be either 1 or 0"]}, status=400)
        total_follows = follow_restaurant(user, restaurant, follow)
        return Response({'num_followers': total_follows})
