from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse

from rest_framework.generics import ListAPIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from blog.models import Blog
from blog.serializer import BlogSerializer
from restaurant.models import Restaurant
from accounts.models import User


class GetBlogsRestaurant(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self, **kwargs):
        blogs = (Blog.objects.filter(restaurant_id=self.kwargs['restaurant_id'])).order_by('-created_timestamp')
        return blogs