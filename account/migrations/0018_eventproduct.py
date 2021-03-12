# Generated by Django 3.1.3 on 2021-02-03 07:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0017_auto_20210112_0522'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventProduct',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product', models.CharField(max_length=191)),
                ('percent', models.IntegerField()),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='account.event')),
            ],
        ),
    ]