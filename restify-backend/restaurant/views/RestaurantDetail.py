from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, get_object_or_404
from restaurant.serializer import RestaurantDetailSerializer
from restaurant.models import Restaurant, Menu


class RestaurantDetail(RetrieveAPIView):
    serializer_class = RestaurantDetailSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])