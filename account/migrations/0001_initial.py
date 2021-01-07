# Generated by Django 3.1.3 on 2021-01-01 02:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=191)),
                ('_type', models.CharField(max_length=191)),
                ('date', models.DateField()),
                ('duration', models.PositiveIntegerField(blank=True)),
                ('web_presential', models.CharField(max_length=191)),
                ('country', models.CharField(blank=True, max_length=191, null=True)),
                ('state', models.CharField(blank=True, max_length=191, null=True)),
                ('city', models.CharField(blank=True, max_length=191, null=True)),
                ('address', models.CharField(blank=True, max_length=191, null=True)),
                ('solicitant', models.CharField(max_length=191)),
                ('business_unit', models.CharField(max_length=191)),
                ('despartment', models.CharField(max_length=191)),
                ('cost_center', models.CharField(max_length=191)),
                ('virtual_presential', models.CharField(max_length=191)),
                ('displacement', models.CharField(max_length=191)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'ordering': ['date'],
            },
        ),
        migrations.CreateModel(
            name='Specialty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=191)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('business_unit', models.CharField(blank=True, max_length=191, null=True)),
                ('password_link', models.CharField(blank=True, max_length=191, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Speaker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('foreign_flag', models.BooleanField(default=False)),
                ('accept_information_rule', models.BooleanField(default=False, null=True)),
                ('name', models.CharField(max_length=191)),
                ('father_name', models.CharField(blank=True, max_length=191, null=True)),
                ('mother_name', models.CharField(blank=True, max_length=191, null=True)),
                ('dob', models.DateField()),
                ('birthplace', models.CharField(max_length=191)),
                ('civil_state', models.CharField(max_length=191)),
                ('scholarity', models.CharField(max_length=191)),
                ('social_number', models.CharField(blank=True, max_length=191, null=True)),
                ('service_provider', models.CharField(max_length=191)),
                ('country', models.CharField(max_length=191)),
                ('state', models.CharField(max_length=191)),
                ('city', models.CharField(max_length=191)),
                ('neighborhood', models.CharField(max_length=191)),
                ('cep', models.CharField(max_length=191)),
                ('ddd', models.CharField(blank=True, max_length=191, null=True)),
                ('id_number', models.CharField(blank=True, max_length=191, null=True)),
                ('document_issue_date', models.DateField()),
                ('emitting_organ', models.CharField(blank=True, max_length=191, null=True)),
                ('email', models.CharField(max_length=191, unique=True)),
                ('mobile', models.IntegerField()),
                ('tier', models.IntegerField()),
                ('fax', models.IntegerField(blank=True, null=True)),
                ('linkedin', models.CharField(blank=True, max_length=191, null=True)),
                ('lattes', models.CharField(blank=True, max_length=191, null=True)),
                ('orcid', models.CharField(blank=True, max_length=191, null=True)),
                ('account_owner', models.CharField(blank=True, max_length=191, null=True)),
                ('address', models.CharField(blank=True, max_length=191, null=True)),
                ('agency', models.CharField(blank=True, max_length=191, null=True)),
                ('bank_address', models.CharField(blank=True, max_length=191, null=True)),
                ('bank_name', models.CharField(blank=True, max_length=191, null=True)),
                ('cnpj', models.CharField(blank=True, max_length=191, null=True)),
                ('company_name', models.CharField(blank=True, max_length=191, null=True)),
                ('cpf', models.CharField(blank=True, max_length=191, null=True)),
                ('iban_account', models.CharField(blank=True, max_length=191, null=True)),
                ('pix', models.CharField(blank=True, max_length=191, null=True)),
                ('juridical_address', models.CharField(blank=True, max_length=191, null=True)),
                ('national_id', models.CharField(blank=True, max_length=191, null=True)),
                ('juridcal_person', models.BooleanField(default=False, null=True)),
                ('swift_bic', models.CharField(blank=True, max_length=191, null=True)),
                ('uf_city', models.CharField(blank=True, max_length=191, null=True)),
                ('uf_crm', models.CharField(blank=True, max_length=191, null=True)),
                ('registration_in_city', models.BooleanField(default=False, null=True)),
                ('social_security', models.BooleanField(default=False, null=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('specialty', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='account.specialty')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='Price',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tier', models.CharField(max_length=191)),
                ('program_type', models.CharField(max_length=191)),
                ('role', models.CharField(max_length=191)),
                ('factor', models.PositiveIntegerField(blank=True)),
                ('standard_price', models.PositiveIntegerField(blank=True)),
                ('hour_price', models.PositiveIntegerField(blank=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('specialty', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='account.specialty')),
            ],
            options={
                'ordering': ['role'],
            },
        ),
        migrations.CreateModel(
            name='EventSpeaker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.PositiveIntegerField(blank=True)),
                ('role', models.CharField(blank=True, max_length=191, null=True)),
                ('price', models.FloatField(default=0)),
                ('status', models.BooleanField(default=False, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.event')),
                ('speaker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.speaker')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
        migrations.AddField(
            model_name='event',
            name='speaker',
            field=models.ManyToManyField(through='account.EventSpeaker', to='account.Speaker'),
        ),
    ]
