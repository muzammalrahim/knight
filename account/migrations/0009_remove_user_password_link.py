# Generated by Django 3.1.3 on 2020-12-30 19:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_user_password_link'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='password_link',
        ),
    ]
