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
		CustomUser.objects.create(business_unit=custom_user['business_unit'], user=user)
		return user

	def update(self, instance, validated_data):
		if 'groups' in validated_data:
			groups = validated_data.pop('groups')
			instance.groups.clear()
			instance.groups.add(*groups)
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)
		instance.email = validated_data.get('email', instance.email)
		instance.username = validated_data.get('username', instance.username)
		# instance.business_unit = validated_data.get('business_unit', instance.business_unit)
		instance.save()
		return instance

	class Meta:
		model = User
		fields = ('id', 'username', 'first_name', 'last_name', 'email', 'business_unit', 'groups')
		# fields = '__all__'



class GroupSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Group
		fields = ['id', 'name']

class EventSerializer(serializers.ModelSerializer):
	def __init__(self, *args, **kwargs):
		super(EventSerializer, self).__init__(*args, **kwargs)
		self.fields['speaker'].required = True
	class Meta:
		model = Event
		fields = '__all__'

class SpeakerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Speaker
		fields = '__all__'