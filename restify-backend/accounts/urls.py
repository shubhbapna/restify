from django.urls import path
from accounts.views.login import LoginView
from accounts.views.logout import LogoutView
from accounts.views.notification import NotificationView
from accounts.views.register import RegisterView
from accounts.views.profile import ProfileView

app_name = 'accounts'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name='profile'),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("notification/", NotificationView.as_view(), name="notification")
]
