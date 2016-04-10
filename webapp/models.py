from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models


class Group(models.Model):
    username = models.CharField(max_length=25)
    groupname = models.CharField(max_length=50)

    def __str__(self):
        return self.groupname


class Post(models.Model):
    group = models.ForeignKey(Group, related_name='group_post')
    post_link = models.CharField(max_length=300)
    unsaveURL = models.CharField(max_length=310)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10)

    # Comments
    body = models.TextField(blank=True, null=True, max_length=40000)

    # Submissions
    title = models.CharField(blank=True, null=True, max_length=300)
    url = models.CharField(blank=True, null=True, max_length=300)

    def __str__(self):
        return self.name
