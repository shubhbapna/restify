from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from restaurant.serializer import RestaurantSerializer
from restaurant.models import Restaurant, Menu
from rest_framework import filters


class SearchRestaurants(ListAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'address', 'menu__name']
    queryset = Restaurant.objects.all().order_by("-num_likes", "-num_followers")