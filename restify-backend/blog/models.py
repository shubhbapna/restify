from django.db import models
from django.db.models import CASCADE

from restaurant.models import Restaurant

# Create your models here.
class Blog(models.Model):

    created_timestamp = models.DateTimeField(auto_now_add=True) 
    modified_timestamp = models.DateTimeField(auto_now=True) 
    title = models.CharField(max_length=200)  
    content = models.TextField()
    imgs = models.ImageField(upload_to='blog/blog-logo/', null=True, blank=True)
    numLikes = models.PositiveIntegerField(default=0, editable=False) 
    restaurant = models.ForeignKey(to=Restaurant, related_name = 'blog_of', on_delete=CASCADE)