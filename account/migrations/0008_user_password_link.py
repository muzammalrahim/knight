# Generated by Django 3.1.3 on 2020-12-29 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0007_auto_20201224_1322'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password_link',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
    ]