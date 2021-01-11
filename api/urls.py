from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from account import views as users_view
from django.conf.urls import url

router = DefaultRouter()

# router.register(r'speakerperson', users_view.SpeakerPersonSerializer)

user_detail = users_view.UserViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

events_list = users_view.EventsViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'destroy'
})

events_detail = users_view.EventsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    # 'delete': 'destroy'
})

event_speaker_list = users_view.EventSpeakerViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'destroy'
})
event_speaker_detail = users_view.EventSpeakerViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    # 'delete': 'destroy'
})

price_list = users_view.PriceViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'destroy'
})

specialty_list = users_view.SpecialtyViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'destroy'
})

speakers_list = users_view.SpeakersViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

speakers_detail = users_view.SpeakersViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

urlpatterns = format_suffix_patterns([

    path('login', users_view.login),
    path('logout', users_view.logout),

    path('users/<pk>/', user_detail),

    path('events', events_list, name='events'),
    path('event/<pk>/', events_detail, name='event'),
    path('events/<pk>/', events_list, name='delete'),

    path('event_speaker', event_speaker_list, name='event_speakers'),
    path('event_speaker/<pk>/', event_speaker_detail, name='event_speaker'),
    path('event_speaker/<pk>/', event_speaker_list, name='event_speaker_delete'),

    path('speakers', speakers_list, name='speakers'),
    path('speaker/<pk>', speakers_detail, name='speaker'),

    path('price', price_list, name='price'),
    path('specialty', specialty_list, name='specialty'),
])
