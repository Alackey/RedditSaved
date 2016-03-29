from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models


class Group(models.Model):
    username = models.CharField(max_length=25)
    groupname = models.CharField(max_length=50)
    posts = JSONField(blank=True, null=True, default={"data": []})
    # posts = ArrayField(
    #     JSONField(blank=True, null=True),
    #     blank=True,
    #     null=True
    # )

    def __str__(self):
        return self.groupname
