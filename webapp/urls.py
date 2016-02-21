from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^callback/$', views.callback, name='callback'),
    url(r'^dashboard/$', views.dashboard, name='dashboard'),
    url(r'^unsave/$', views.unsave, name='unsave'),
    url(r'^groups/$', views.groups, name='groups'),
]
