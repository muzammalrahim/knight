from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions, authentication
from rest_framework.response import Response
from account.backend import id_generator
from rest_framework.decorators import api_view, action, permission_classes, authentication_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from account.models import User
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
from django.template.loader import get_template

from account.models import Speaker

from account.models import EventProduct


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
            response_data['fullname'] = request.user.first_name + ' ' + request.user.last_name
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


class SpecialtyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer


# permission_classes = [permissions.IsAuthenticated]


class PriceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    filterset_fields = ['program_type', 'specialty', 'tier', 'role']

    def list(self, request, *args, **kwargs):
        program_type = request.GET.get('program_type', None)
        specialty = request.GET.get('specialty', None)
        tier = request.GET.get('tier', None)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# permission_classes = [permissions.IsAuthenticated]


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

        return Response(data)


class EventProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = EventProduct.objects.all()
    serializer_class = EventProductSerializer


class EventSpeakerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = EventSpeaker.objects.all()
    serializer_class = EventSpeakerSerializer

    # permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode('utf-8'))
        print('request_data', request_data)
        if 'ids' in request_data:
            EventSpeaker.objects.filter(id__in=request_data['ids']).delete()
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            return super(EventSpeakerViewSet, self).destroy(request, *args, **kwargs)

    def retrieve(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        return Response(data)


class SpeakersViewSet(viewsets.ModelViewSet):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer

    def destroy(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode('utf-8'))
        if 'ids' in request_data:
            Speaker.objects.filter(id__in=request_data['ids']).delete()
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            return super(SpeakersViewSet, self).destroy(request, *args, **kwargs)

    def retrieve(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['persons'] = SpeakerPerson.objects.filter(speaker=instance).values()
        return Response(data)


class SpeakerPersonViewSet(viewsets.ModelViewSet):
    queryset = SpeakerPerson.objects.all()
    serializer_class = SpeakerPersonSerializer

    def destroy(self, request, *args, **kwargs):
        request_data = json.loads(request.body.decode('utf-8'))
        if 'id' in request_data:
            for id in request_data['id']:
                SpeakerPerson.objects.filter(id=id).delete()
            return Response(status=HTTP_204_NO_CONTENT)
        else:
            return super(SpeakerPersonViewSet, self).destroy(request, *args, **kwargs)


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
    print('>>', user)
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


@api_view(["POST"])
def forget_password(request):
    email = request.data.get("email")
    user = User.objects.filter(email=email)
    if user.exists():
        user = user.first()
        random_id = id_generator(64)
        from account.models import User as CustomUser
        c_user = CustomUser.objects.filter(user=user).first()
        if c_user is None:
            CustomUser.objects.create(password_link=random_id, user=user)
        else:
            CustomUser.objects.update(password_link=random_id, user=user)
        user.save()
        reset_link = '{}/auth/reset-password/{}'.format(settings.SITE_URL, random_id)
        html_content = get_template('account/general.html') \
            .render({'reset_link': reset_link})

        send_emails('Reset your password', html_content, [email])
        return Response({'message': 'Email has been send', 'success': True},
                        status=HTTP_200_OK)
    else:
        return Response({'message': 'Email not exists', 'success': False},
                        status=HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes((AllowAny,))
def reset_password(request):
    email = request.data.get("email")
    password = request.data.get("password")
    password_link = request.data.get("password_link")
    users = User.objects.filter(email=email).first()
    from account.models import User as CustomUser
    CustomUser = CustomUser.objects.filter(user=users).first()
    if CustomUser.password_link == password_link:
        users.set_password(password)
        users.save()
        CustomUser.password_link = None
        CustomUser.save()
        return Response({'message': 'Password has been updated successfully', 'success': True},
                        status=HTTP_200_OK)
    else:
        return Response({'message': 'You are not authorized to access', 'success': False},
                        status=HTTP_404_NOT_FOUND)
