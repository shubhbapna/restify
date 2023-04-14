from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractUser):
    phone_number = PhoneNumberField(blank=True)
    avatar = models.ImageField(upload_to='accounts/avatars/', null=True, blank=True)
    is_owner = models.BooleanField(default=False)
    liked_restaurant = models.ManyToManyField("restaurant.Restaurant", related_name="liked_restaurants")
    followed_restaurant = models.ManyToManyField("restaurant.Restaurant", related_name="followed_restaurants")
    liked_blogs = models.ManyToManyField("blog.Blog", related_name="liked_blogs")

class Notification(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    message = models.TextField()
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True, related_name="user")
