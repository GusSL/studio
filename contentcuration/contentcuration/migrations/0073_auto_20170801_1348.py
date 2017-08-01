# -*- coding: utf-8 -*-
# Generated by Django 1.9.13 on 2017-08-01 20:48
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contentcuration', '0072_contentnode_language'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='uploaded_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='disk_space',
            field=models.IntegerField(default=500000000, help_text='How many bytes a user can upload'),
        ),
    ]
