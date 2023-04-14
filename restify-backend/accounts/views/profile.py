from rest_framework.generics import RetrieveUpdateAPIView
from accounts.serializer import ProfileUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class ProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = ProfileUserSerializer

    def get_object(self):
        return self.request.user