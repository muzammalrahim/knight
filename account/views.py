from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions, authentication
from account.serializers import UserSerializer, GroupSerializer
from rest_framework.decorators import api_view, action, permission_classes, authentication_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from account.models import Event, Speaker, User as CustomUser
from account.serializers import *
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.status import (
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
	HTTP_200_OK,
	HTTP_204_NO_CONTENT
)
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
import json


class UserViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows users to be viewed or edited.
	"""
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

	def retrieve(self, request: Request, *args, **kwargs):
		if kwargs.get('pk') == 'me':
			response_data = self.get_serializer(request.user).data
			# response_data['groups'] = request.user.groups.first().name
			response_data['fullname']= request.user.first_name+' '+request.user.last_name
			return Response(response_data)

		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	# def destroy(self, request, *args, **kwargs):
	# 	request_data = json.loads(request.body.decode('utf-8'))
	# 	if 'ids' in request_data:
	# 		CustomUser.objects.filter(id__in=request_data['ids']).delete()
	# 		return Response(status=HTTP_204_NO_CONTENT)
	# 	else:
	# 		return super(UserViewSet, self).destroy(request, *args, **kwargs)
	


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
	# authentication_classes = [authentication.TokenAuthentication]

	def destroy(self, request, *args, **kwargs):
		request_data = json.loads(request.body.decode('utf-8'))
		if 'ids' in request_data:
			Event.objects.filter(id__in=request_data['ids']).delete()
			return Response(status=HTTP_204_NO_CONTENT)
		else:
			return super(EventsViewSet, self).destroy(request, *args, **kwargs)
	
	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		
		related_models = ['speaker']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)

class SpeakersViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows groups to be viewed or edited.
	"""
	queryset = Speaker.objects.all()
	serializer_class = SpeakerSerializer
	# permission_classes = [permissions.IsAuthenticated]

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		return Response(data)
	
	def destroy(self, request, *args, **kwargs):
		request_data = json.loads(request.body.decode('utf-8'))
		if 'ids' in request_data:
			Speaker.objects.filter(id__in=request_data['ids']).delete()
			return Response(status=HTTP_204_NO_CONTENT)
		else:
			return super(SpeakersViewSet, self).destroy(request, *args, **kwargs)

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
	print(user)
	if not user:
		return Response({'error': 'Invalid Credentials'},
						status=HTTP_404_NOT_FOUND)

	token, _ = Token.objects.get_or_create(user=user)
	return Response({'token': token.key},
					status=HTTP_200_OK)

@api_view(["POST"])
def logout(request):
	print(request.user.auth_token)
	request.user.auth_token.delete()
	return Response(status=HTTP_200_OK)
