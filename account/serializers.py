from django.contrib.auth.models import User, Group
from account.models import Event, Speaker, User as CustomUser
from rest_framework import serializers
from django.contrib.auth.hashers import make_password



class UserSerializer(serializers.ModelSerializer):
    business_unit = serializers.CharField(source='user.business_unit')

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        custom_user = validated_data.pop('user')
        # permissions = validated_data.pop('user_permissions')
        
        user = User.objects.create(**validated_data)
        print('customeruser', custom_user)
        CustomUser.objects.create(business_unit=custom_user['business_unit'], user=user)
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'business_unit')



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