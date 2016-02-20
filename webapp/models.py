from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models


class Group(models.Model):
    username = models.CharField(max_length=25)
    groupname = models.CharField(max_length=50)
    posts = JSONField(blank=True, null=True)
    # posts = ArrayField(
    #     JSONField(),
    #     size=50,
    #     default=[]
    # )

    def __str__(self):
        return self.groupname
