from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import DestroyAPIView
from restaurant.serializer import MenuSerializer
from restaurant.models import Restaurant, Menu
from rest_framework.exceptions import PermissionDenied
from http.client import FORBIDDEN
from django.shortcuts import get_object_or_404
from accounts.utils import menu_updated_notification


class DeleteMenu(DestroyAPIView):
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        get_object_or_404(Menu, id=self.kwargs['menu_id'])
        if not self.request.user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        restaurant = Restaurant.objects.get(owner=self.request.user)
        if Menu.objects.get(id=self.kwargs['menu_id']) not in restaurant.menu.all():
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        return Menu.objects.get(id=self.kwargs['menu_id'])
    
    def destroy(self, request, *args, **kwargs):
        s = super().destroy(request, *args, **kwargs)
        menu_updated_notification(Restaurant.objects.get(owner=self.request.user))
        return s