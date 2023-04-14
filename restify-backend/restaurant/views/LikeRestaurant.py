from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from restaurant.serializer import RestaurantSerializer
from rest_framework.response import Response
from restaurant.models import Restaurant
from accounts.models import User
from accounts.utils import like_restaurant
from django.shortcuts import get_object_or_404


class LikeRestaurant(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, restaurant_id, format=None):
        restaurant = get_object_or_404(Restaurant, id = restaurant_id)
        user = User.objects.get(id = request.user.id)
        data_like = request.data.get('like', None)
        like = None
        if data_like == 1:
            like = True
        elif data_like == 0:
            like = False
        else:
            return Response({"like": ["Should be either 1 or 0"]}, status=400)
        total_likes = like_restaurant(user, restaurant, like)
        return Response({'num_likes': total_likes})

