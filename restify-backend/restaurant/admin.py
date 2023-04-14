from django.contrib import admin
from restaurant.models import Comment, Picture, Restaurant, Menu

# Register your models here.

admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(Comment)
admin.site.register(Picture)