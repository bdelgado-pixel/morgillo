from django.contrib import admin
from django.urls import path
from content import views
urlpatterns = [path('admin/',admin.site.urls),path('api/content/',views.content),path('api/campaigns/',views.campaigns),path('api/media/<uuid:asset_id>/',views.media),path('api/health/',views.health)]
