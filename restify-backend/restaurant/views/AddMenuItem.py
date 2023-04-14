from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from restaurant.serializer import MenuSerializer
from rest_framework.exceptions import PermissionDenied
from http.client import FORBIDDEN
from restaurant.models import Menu, Restaurant
from accounts.utils import menu_updated_notification


class AddMenuItem(CreateAPIView):
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        if not self.request.user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        restaurant = Restaurant.objects.get(owner=self.request.user)
        s = super().create(request, *args, **kwargs)
        menu = Menu.objects.get(id=s.data['id'])
        menu.restaurant = restaurant
        menu.save()
        menu_updated_notification(Restaurant.objects.get(owner=self.request.user))
        return s