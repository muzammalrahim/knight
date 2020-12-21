from django.contrib import admin
from account.models import Event, Speaker, Specialty, Price

# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date')

@admin.register(Speaker)
class SpeakerAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')

@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at')