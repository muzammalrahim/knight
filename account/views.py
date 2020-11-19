from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from account.serializers import UserSerializer, GroupSerializer
from rest_framework.decorators import api_view, action, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from account.models import Event, Speaker
from account.serializers import *
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.status import (
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
	HTTP_200_OK,
	HTTP_204_NO_CONTENT
)


class UserViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows users to be viewed or edited.
	"""
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows groups to be viewed or edited.
	"""
	queryset = Group.objects.all()
	serializer_class = GroupSerializer
	permission_classes = [permissions.IsAuthenticated]

class EventsViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows groups to be viewed or edited.
	"""
	queryset = Event.objects.all()
	serializer_class = EventSerializer
	# permission_classes = [permissions.IsAuthenticated]

class SpeakersViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows groups to be viewed or edited.
	"""
	queryset = Speaker.objects.all()
	serializer_class = SpeakerSerializer
	# permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
def api_root(request, format=None):
	return Response({
		'users': reverse('users', request=request, format=format),
	})

@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
	email = request.data.get("email")
	password = request.data.get("password")
	if email is None or password is None:
		return Response({'error': 'Please provide both email and password'},
						status=HTTP_400_BAD_REQUEST)
	user = authenticate(email=email, password=password)
	if not user:
		return Response({'error': 'Invalid Credentials'},
						status=HTTP_404_NOT_FOUND)

	# create access logs entry
	AbAccesslogs(user=user, payload=json.dumps(makeRequestDict(request.META))).save()

	token, _ = Token.objects.get_or_create(user=user)
	return Response({'token': token.key},
					status=HTTP_200_OK)

@api_view(["POST"])
def logout(request):
	request.user.auth_token.delete()
	return Response(status=HTTP_200_OK)
