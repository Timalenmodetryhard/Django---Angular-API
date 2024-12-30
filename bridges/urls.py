from django.urls import path
from .serializers import BridgeSerializer
from .models import Bridge
from .views import BridgeView

urlpatterns = [
    path('bridges/', BridgeView.as_view(), name='bridge-list'),
    path('bridges/<str:pk>/', BridgeView.as_view(), name='bridge-detail'),
]
