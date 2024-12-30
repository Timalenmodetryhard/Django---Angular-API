from rest_framework import serializers
from .models import Bridge
from django.contrib.gis.geos import Point


class BridgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bridge
        fields = ['name', 'location', 'bridge_id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.location:
            representation['location'] = {
                'longitude': instance.location.x,
                'latitude': instance.location.y
            }

        return representation

    def create(self, validated_data):
        location_data = validated_data.get('location')
        if isinstance(location_data, dict):
            coordinates = location_data.get('coordinates')
            validated_data['location'] = Point(coordinates[0], coordinates[1], srid=4326)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        location_data = validated_data.get('location')
        if isinstance(location_data, dict):
            coordinates = location_data.get('coordinates')
            validated_data['location'] = Point(coordinates[0], coordinates[1], srid=4326)
        return super().update(instance, validated_data)