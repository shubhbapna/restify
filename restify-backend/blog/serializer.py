from rest_framework import serializers
from blog.models import Blog


class BlogSerializer(serializers.ModelSerializer):

    class Meta:

        model = Blog

        fields = ['id', 'created_timestamp',
                    'modified_timestamp',
                    'title',
                    'content',
                    'imgs', 
                    'numLikes', 
                    'restaurant']
        read_only_fields = ['restaurant']

