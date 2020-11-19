from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from account import views as users_view
from django.conf.urls import url


router = DefaultRouter()

events_list = users_view.EventsViewSet.as_view({
	'get': 'list',
	'post': 'create'
})

speakers_list = users_view.SpeakersViewSet.as_view({
	'get': 'list',
	'post': 'create'
})

urlpatterns = format_suffix_patterns([

	path('', users_view.api_root),
	path('login', users_view.login),
	path('logout', users_view.logout),
	
	path('events', events_list, name='events'),
	path('speakers', speakers_list, name='speakers'),
])