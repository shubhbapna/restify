from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from restaurant.serializer import MenuSerializer
from restaurant.models import Menu, Restaurant


class MenuList(ListAPIView):
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        item_type = self.request.query_params.get('item_type', 'M')
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        return Menu.objects.filter(restaurant=restaurant, item_type=item_type).order_by("-price")