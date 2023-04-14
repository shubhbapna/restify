from django.db import models
from django.db.models import SET_NULL
from accounts.models import User
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.


class Restaurant(models.Model):
    owner = models.OneToOneField(to=User, related_name = 'restaurant', on_delete=SET_NULL, null=True)
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='restaurant/restaurant-logo/', null=True, blank=True)
    postal_code = models.CharField(max_length=10)
    phone_num = PhoneNumberField(blank=True)
    num_likes = models.IntegerField(default=0)
    num_followers = models.IntegerField(default=0)


class Menu(models.Model):
    MAINS = 'M'
    DESSERT = 'D'
    BEVERAGE = 'B'
    APPETIZER = 'A'
    MENU_ITEM_TYPE = [
        (MAINS, "mains"),
        (DESSERT, "dessert"),
        (BEVERAGE, "beverage"),
        (APPETIZER, "appetizer")
    ]
    restaurant = models.ForeignKey(to=Restaurant, related_name='menu', on_delete=SET_NULL, null=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    item_type = models.CharField(choices=MENU_ITEM_TYPE, max_length=1, default=MAINS)


class Comment(models.Model):
    def get_avatar(self):
        print(self)
        if self.user and self.user.avatar:
            return self.user.avatar.url
        else:
            return ""
    restaurant = models.ForeignKey(to=Restaurant, on_delete=SET_NULL, null=True, related_name='comments')
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(to=User, on_delete=SET_NULL, null=True, related_name='comments')
    message = models.TextField()


class Picture(models.Model):
    restaurant = models.ForeignKey(to=Restaurant, on_delete=SET_NULL, null=True, related_name='pictures')
    image = models.ImageField(upload_to='restaurant/restaurant-pictures/', null=True, blank=True)