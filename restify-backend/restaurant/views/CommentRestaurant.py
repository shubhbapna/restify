from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from restaurant.serializer import CommentSerializer
from restaurant.models import Restaurant, Comment
from accounts.utils import comment_restaurant_notification
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView

class CommentRestaurant(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        get_object_or_404(Restaurant, id=self.kwargs['restaurant_id'])
        return Comment.objects.filter(restaurant__pk = self.kwargs['restaurant_id']).order_by('-timestamp')

    def create(self, request, *args, **kwargs):
        user = self.request.user
        restaurant = get_object_or_404(Restaurant, id = kwargs['restaurant_id'])
        s = super().create(request, *args, **kwargs)
        comment = Comment.objects.get(id=s.data['id'])
        comment.user = user
        comment.restaurant = restaurant
        comment.save()
        s.data['username'] = user.username
        if user.avatar:
            s.data['avatar'] = user.avatar.url
        comment_restaurant_notification(user, restaurant)
        return s

