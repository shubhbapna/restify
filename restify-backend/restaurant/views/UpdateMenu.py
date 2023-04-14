from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from accounts.models import User
from accounts.utils import menu_updated_notification
from restaurant.serializer import MenuSerializer
from rest_framework.exceptions import PermissionDenied, NotFound
from http.client import FORBIDDEN, NOT_FOUND
from restaurant.models import Menu, Restaurant


class UpdateMenu(UpdateAPIView):
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        if not Menu.objects.filter(id=self.kwargs['menu_id']):
            raise NotFound(detail=NOT_FOUND, code=404)
        if not self.request.user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        restaurant = Restaurant.objects.get(owner=self.request.user)
        if Menu.objects.get(id=self.kwargs['menu_id']) not in restaurant.menu.all():
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        return Menu.objects.get(id=self.kwargs['menu_id'])

    def update(self, request, *args, **kwargs):
        result = super().update(request, *args, **kwargs)
        menu_updated_notification(Restaurant.objects.get(owner=self.request.user))
        return result