from django.urls import path
from restaurant.views.AddMenuItem import AddMenuItem
from restaurant.views.AddPicture import AddPicture
from restaurant.views.CreateRestaurant import CreateRestaurant
from restaurant.views.DeleteMenu import DeleteMenu
from restaurant.views.MenuList import MenuList
from restaurant.views.RestaurantDetail import RestaurantDetail
from restaurant.views.SearchRestaurants import SearchRestaurants
from restaurant.views.UpdateMenu import UpdateMenu
from restaurant.views.UpdateRestaurant import UpdateRestaurant
from restaurant.views.DeletePicture import DeletePicture
from restaurant.views.LikeRestaurant import LikeRestaurant
from restaurant.views.FollowRestaurant import FollowRestaurant
from restaurant.views.CommentRestaurant import CommentRestaurant
from restaurant.views.GetBlogsRestaurant import GetBlogsRestaurant

app_name = 'restaurant'

urlpatterns = [
    path('create/', CreateRestaurant.as_view(), name='create-restaurant'),
    path('update/', UpdateRestaurant.as_view(), name='update-restaurant'),
    path('picture/add/', AddPicture.as_view(), name='add-picture'),
    path('picture/<int:picture_id>/delete/', DeletePicture.as_view(), name='delete-picture'),
    path('menu/add/', AddMenuItem.as_view(), name='add-menu-item'),
    path('menu/<int:menu_id>/update/', UpdateMenu.as_view(), name='update-menu'),
    path('menu/<int:menu_id>/delete/', DeleteMenu.as_view(), name='delete-menu'),
    path('<int:restaurant_id>/like/', LikeRestaurant.as_view(), name='like-restaurant'),
    path('<int:restaurant_id>/follow/', FollowRestaurant.as_view(), name='follow-restaurant'),
    path('<int:restaurant_id>/comment/', CommentRestaurant.as_view(), name='comment-restaurant'),
    path('search/', SearchRestaurants.as_view(), name='search-restaurants'),
    path('search/<int:restaurant_id>/', RestaurantDetail.as_view(), name='restaurant-detail'),
    path('<int:restaurant_id>/blogs/', GetBlogsRestaurant.as_view(), name='restaurant-blogs'),
    path('<int:restaurant_id>/menu/list/', MenuList.as_view(), name='menu-list'),
]
