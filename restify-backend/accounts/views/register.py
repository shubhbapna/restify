from rest_framework.generics import CreateAPIView
from accounts.models import User
from accounts.serializer import RegisterUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


class RegisterView(CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = RegisterUserSerializer
    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        user = User.objects.get(username=request.data["username"])
        user.set_password(request.data["password"])
        user.save()
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'is_owner': user.is_owner
        })

    