from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import DestroyAPIView
from restaurant.serializer import PictureSerializer
from rest_framework.exceptions import PermissionDenied, NotFound
from http.client import FORBIDDEN, NOT_FOUND
from restaurant.models import Restaurant, Picture


class DeletePicture(DestroyAPIView):
    serializer_class = PictureSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        if not Picture.objects.filter(id=self.kwargs['picture_id']):
            raise NotFound(detail=NOT_FOUND, code=404)
        if not self.request.user.is_owner:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        restaurant = Restaurant.objects.get(owner=self.request.user)
        if Picture.objects.get(id=self.kwargs['picture_id']) not in restaurant.pictures.all():
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        return Picture.objects.get(id=self.kwargs['picture_id'])