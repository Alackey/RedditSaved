# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-10 02:41
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0004_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='posts',
        ),
        migrations.AlterField(
            model_name='post',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_post', to='webapp.Group'),
        ),
    ]