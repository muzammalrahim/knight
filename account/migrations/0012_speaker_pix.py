# Generated by Django 3.1.3 on 2020-12-31 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0011_auto_20201230_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='speaker',
            name='pix',
            field=models.CharField(blank=True, max_length=191, null=True),
        ),
    ]