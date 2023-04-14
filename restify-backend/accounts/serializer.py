from rest_framework import serializers
from accounts.models import User, Notification


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'password']
    

class ProfileUserSerializer(serializers.ModelSerializer):
    restaurant = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'avatar', 'is_owner',
                    'liked_restaurant', 'followed_restaurant', 'liked_blogs', 'restaurant']
        read_only_fields = ['liked_restaurant', 'followed_restaurant', 'liked_blogs', 'is_owner']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['message', 'timestamp']
    