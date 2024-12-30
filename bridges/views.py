from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Bridge
from .serializers import BridgeSerializer
from rest_framework import status
from rest_framework.response import Response

class BridgeView(APIView):
    def get(self, request, pk=None):
        if pk is None:
            bridges = Bridge.objects.all()
            serializer = BridgeSerializer(bridges, many=True)
            return Response({"bridges": serializer.data})
        else:
            bridge = get_object_or_404(Bridge, pk=pk)
            serializer = BridgeSerializer(bridge)
            return Response(serializer.data)
    
    def post(self, request):
        bridge_data = request.data.get('bridge')

        serializer = BridgeSerializer(data=bridge_data)
        if serializer.is_valid(raise_exception=True):
            bridge_saved = serializer.save()
            return Response({"success": f"Bridge '{bridge_saved.name}' created successfully"})
        return Response({"error": "Invalid data"}, status=400)
    
    def put(self, request, pk):
        bridge = get_object_or_404(Bridge, pk=pk)
        serializer = BridgeSerializer(bridge, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": f"Bridge '{serializer.data['name']}' updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        bridge = get_object_or_404(Bridge.objects.all(), pk=pk)
        bridge.delete()
        return Response({"message": "Bridge with id `{}` has been deleted.".format(pk)},status=204)

