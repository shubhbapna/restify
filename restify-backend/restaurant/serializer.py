from rest_framework import serializers
from restaurant.models import Comment, Menu, Picture, Restaurant


class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'logo', 'postal_code', 'phone_num', 'num_likes', 'num_followers']
        read_only_fields = ['num_likes', 'num_followers']


class PictureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Picture
        fields = ['id', 'image']  


class MenuSerializer(serializers.ModelSerializer):

    class Meta:
        model = Menu
        fields = ['id', 'name', 'description', 'price', 'item_type'] 

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source = 'user.username')
    avatar = serializers.ReadOnlyField(source = 'get_avatar', allow_null=True)
    class Meta:
        model = Comment
        fields = ['id', 'message', 'username', 'avatar', 'timestamp']



class RestaurantDetailSerializer(serializers.ModelSerializer):
    pictures = PictureSerializer(many=True)

    class Meta:
        model = Restaurant      
        fields = ['id', 'name', 'address', 'logo', 'postal_code', 'phone_num',
        'num_likes', 'num_followers', 'pictures']
