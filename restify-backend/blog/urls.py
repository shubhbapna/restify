from django.urls import path  
from blog.views import blogView, blogUpdateView, blogCreateView, blogListView, blogLikeView, blogDeleteView
  
#from banks.forms.add_bank import add_view  
#from banks.forms.add_branch import add_branch  
  
app_name = 'blog'  
  
urlpatterns = [  
    path('<int:blog_id>/', blogView.as_view(), name ="view_blog"),
    path('<int:blog_id>/update/', blogUpdateView.as_view(), name ="update_blog"),
    path('create/', blogCreateView.as_view(), name ="create_blog"),
    path('feed/', blogListView.as_view(), name='feed_blogs'),
    path('<int:blog_id>/like/', blogLikeView.as_view(), name='like_blog'),
    path('<int:blog_id>/delete/', blogDeleteView.as_view(), name='delete_blog')
]  