from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404, RetrieveAPIView, UpdateAPIView, CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from http.client import FORBIDDEN, NOT_FOUND
from blog.models import Blog
from blog.serializer import BlogSerializer
from restaurant.models import Restaurant
from accounts.models import User
from accounts.utils import blog_posted_notification, liked_blog


class blogView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = BlogSerializer

    def get_object(self):
        return get_object_or_404(Blog, id=self.kwargs['blog_id'])

class blogDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = BlogSerializer

    def get_object(self):
        user = get_object_or_404(User, id = self.request.user.id)
        blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        restaurant = blog.restaurant
        if(restaurant.owner != user):
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        return get_object_or_404(Blog, id=self.kwargs['blog_id'])

class blogUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = BlogSerializer

    def get_object(self):
        return get_object_or_404(Blog, id=self.kwargs['blog_id'])

    def update(self, request, *args, **kwargs):
        user = get_object_or_404(User, id=self.request.user.id)
        blog = get_object_or_404(Blog, id=self.kwargs['blog_id'])
        restaurant = Restaurant.objects.get(owner = user)
        if blog.restaurant.id != restaurant.id:
            raise PermissionDenied(detail=FORBIDDEN, code=403)
        return super().update(request, *args, **kwargs)

class blogCreateView(CreateAPIView):
    serializer_class = BlogSerializer
    queryset = Blog.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):
        user = self.request.user
        restaurant = get_object_or_404(Restaurant, owner = user.id)
        data = request.data
        data['restaurant'] = restaurant.id
        blog = BlogSerializer(data = data)         
        
        if blog.is_valid():
            blog.save(restaurant = restaurant)
            blog_posted_notification(restaurant)
        else:
            missing = []
            if not ('title' in request.data):
                missing += ['title is missing']
            if not ('content' in request.data):
                missing += ['content is missing']
            return Response({'detail': missing}, status=status.HTTP_400_BAD_REQUEST)
        return Response(blog.data)

class blogListView(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        user = User.objects.get(id = self.request.user.id)
        followed = list((user.followed_restaurant).only("id"))
        blogs = (Blog.objects.filter(restaurant_id__in = followed).order_by('-created_timestamp'))
        return blogs

class blogLikeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, blog_id, format=None):
        blog = get_object_or_404(Blog, id=blog_id)
        user = User.objects.get(id = request.user.id)
        data_like = request.data.get('like', None)
        like = None
        if data_like == 1:
            like = True
        elif data_like == 0:
            like = False
        else:
            return Response({"like": ["Should be either 1 or 0"]}, status=400)
        total_likes = liked_blog(user, blog, like)
        return Response({'num_likes': total_likes})

