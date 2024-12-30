from django.contrib.gis.db import models

class Bridge(models.Model):
    name = models.CharField(max_length=100)
    location = models.PointField(geography=True, srid=4326)
    bridge_id = models.CharField(max_length=10, primary_key=True, default="B000")

    class Meta:
        db_table = "bridges" 

    def __str__(self):
        return self.name
