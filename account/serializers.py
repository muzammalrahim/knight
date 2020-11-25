from django.contrib.auth.models import User, Group
from account.models import Event, Speaker
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ['id','name', '_type', 'date', 'duration', 'web_presential', 'country', 'state', 'city', 'address', 'solicitant', 'business_unit', 'despartment',
        'cost_center','virtual_presential', 'displacement', 'created_at']

class SpeakerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Speaker
        fields = ['id','name','dob','country','created_at']