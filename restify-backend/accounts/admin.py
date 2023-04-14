from django.contrib import admin
from accounts.models import Notification, User
from blog.models import Blog
from django.contrib.auth.admin import UserAdmin

admin.site.register(User, UserAdmin)
admin.site.register(Blog)
admin.site.register(Notification)
