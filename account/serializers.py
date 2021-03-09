from django.contrib.auth.models import User, Group
from account.models import Event, Speaker, User as CustomUser, Price, Specialty, EventSpeaker, SpeakerPerson, \
    EventProduct
from rest_framework import serializers
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    business_unit = serializers.CharField(source='user.business_unit')

    def create(self, validated_data):
        # validated_data['password'] = make_password(validated_data.get('password'))
        custom_user = validated_data.pop('user')
        # permissions = validated_data.pop('user_permissions')

        user = User.objects.create(**validated_data)
        print("user user user",user)
        user.set_password(validated_data.get('password'))
        user.save()
        print("user user", user.password)
        CustomUser.objects.create(business_unit=custom_user['business_unit'], user=user)

        # import uuid
        # keyUUID = uuid.uuid4()
        # user.email_verified = str(keyUUID)
        # user.save()
        # email_template = User.objects.get(message_type='user-registration')
        # subject = email_template.subject
        # user_contact = user.contact.first()
        # url = '{}/login?token={}'.format(settings.SITE_URL, user.email_verified)
        # context = {
        #     'user': str(user_contact.first_name) + " " + str(user_contact.last_name),
        #     'name': mark_safe('<a href="{}")>Confirm Email</a>'.format(url)),
        # }
        # html_content = get_template('templates/general.html').render(context)
        # send_emails(subject, html_content, [user.email])

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
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'business_unit', 'groups', 'is_superuser')
    # fields = '__all__'


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = '__all__'


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']


class SpeakerSerializer(serializers.ModelSerializer):
    person = serializers.ListField(write_only=True)
    def __init__(self, *args, **kwargs):
        super(SpeakerSerializer, self).__init__(*args, **kwargs)

    # person = SpeakerPersonSerializer(many=True, write_only=True)

    def create(self, validated_data):
        persons = validated_data.pop('person')
        speaker = Speaker.objects.create(**validated_data)
        for person in persons:
            person['speaker'] = speaker
            SpeakerPerson.objects.create(**person)
        return speaker

    class Meta:
        model = Speaker
        fields = '__all__'


class EventProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventProduct
        fields = '__all__'


class SpeakerPersonSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(SpeakerPersonSerializer, self).__init__(*args, **kwargs)
        self.fields['speaker'].required = True

    class Meta:
        model = SpeakerPerson
        fields = '__all__'


class EventSpeakerSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(EventSpeakerSerializer, self).__init__(*args, **kwargs)
        self.fields['event'].required = False

    def to_representation(self, instance):
        representation = super(EventSpeakerSerializer, self).to_representation(instance)
        try:
            representation['event'] = EventSerializer(instance.event).data
        except:
            representation['event'] = None
        try:
            representation['speaker'] = SpeakerSerializer(instance.speaker).data

        except:
            representation['speaker'] = None
        return representation

    class Meta:
        model = EventSpeaker
        fields = ['id', 'price', 'speaker', 'event', 'status', 'duration', 'role']


class EventSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(EventSerializer, self).__init__(*args, **kwargs)
        self.fields['speaker'].required = True

    event_speaker = EventSpeakerSerializer(many=True, write_only=True)
    event_product = EventProductSerializer(many=True, write_only=True)
    # event_product = serializers.ListField(write_only=True)

    def create(self, validated_data):
        event_speaker = validated_data.pop('event_speaker')
        event_product = validated_data.pop('event_product')
        event = Event.objects.create(**validated_data)

        for data in event_product:
            data['event'] = event
            EventProduct.objects.create(**data)

        for data in event_speaker:
            data['event'] = event
            EventSpeaker.objects.create(**data)
        return event

    def to_representation(self, instance):
        representation = super(EventSerializer, self).to_representation(instance)
        try:
            represes = EventProduct.objects.filter(event=instance.id).values()
            representation['eventproduct'] = represes
        except:
            representation['eventproduct'] = None

        try:
            represe = EventSpeaker.objects.filter(event=instance.id).values()
            ev_id = list(map(lambda x: x["id"], represe))
            representation['eventspeaker'] = ev_id
        except:
            representation['eventspeaker'] = None

        try:
            representation['speaker'] = SpeakerSerializer(instance.speaker, many=True).data
            for spk_ik in range(len(representation['speaker'])):
                try:
                    representation['speaker'][spk_ik]['event_speaker'] = \
                        EventSpeaker.objects.filter(speaker_id=representation['speaker'][spk_ik]['id'],
                                                    event=instance).values()[0]
                except:
                    representation['speaker']['event_speaker'] = None
        except:
            representation['speaker'] = None
        return representation

    class Meta:
        model = Event
        fields = '__all__'
