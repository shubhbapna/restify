from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from restaurant.serializer import PictureSerializer
from rest_framework.exceptions import PermissionDenied, ParseError
from http.client import FORBIDDEN, BAD_REQUEST
from rest_framework.response import Response
from restaurant.models import Picture, Restaurant


class AddPicture(CreateAPIView):
    serializer_class = PictureSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        if not self.request.user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        restaurant = Restaurant.objects.get(owner=self.request.user)
        s = super().create(request, *args, **kwargs)
        picture = Picture.objects.get(id=s.data['id'])
        picture.restaurant = restaurant
        picture.save()
        return s