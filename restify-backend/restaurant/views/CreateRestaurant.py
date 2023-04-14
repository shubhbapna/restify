from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from restaurant.models import Restaurant
from restaurant.serializer import RestaurantSerializer
from rest_framework.exceptions import PermissionDenied
from http.client import FORBIDDEN


class CreateRestaurant(CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        s = super().create(request, *args, **kwargs)
        rest = Restaurant.objects.get(id=s.data['id'])
        rest.owner = user
        user.is_owner = True
        rest.save()
        user.save()
        return s
