# Generated by Django 3.1.3 on 2021-01-12 05:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0016_auto_20210108_1242'),
    ]

    operations = [
        migrations.AlterField(
            model_name='speakerperson',
            name='speaker',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='account.speaker'),
            preserve_default=False,
        ),
    ]
