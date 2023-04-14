from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView, get_object_or_404
from restaurant.serializer import RestaurantSerializer
from rest_framework.exceptions import PermissionDenied
from http.client import FORBIDDEN
from restaurant.models import Restaurant


class UpdateRestaurant(UpdateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        if not self.request.user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        return get_object_or_404(Restaurant, id=self.request.user.restaurant.id)