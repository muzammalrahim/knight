from django.db import models
from django.contrib.auth.models import User

class User(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	business_unit = models.CharField(max_length=191, blank=True, null=True)
	password_link = models.CharField(max_length=191, blank=True, null=True)

class Specialty(models.Model):
	name = models.CharField(max_length=191)

	deleted_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

	class Meta:
		ordering = ['name']
		
class Speaker(models.Model):
	foreign_flag = models.BooleanField(default=False)
	accept_information_rule = models.BooleanField(null=True, default=False)
	name = models.CharField(max_length=191)
	father_name = models.CharField(max_length=191, blank=True, null=True)
	mother_name = models.CharField(max_length=191, blank=True, null=True)
	dob = models.DateField()
	birthplace = models.CharField(max_length=191)
	civil_state = models.CharField(max_length=191)
	scholarity = models.CharField(max_length=191)
	social_number = models.CharField(max_length=191, blank=True, null=True)
	service_provider = models.CharField(max_length=191)
	country = models.CharField(max_length=191)
	state = models.CharField(max_length=191)
	city = models.CharField(max_length=191)
	neighborhood = models.CharField(max_length=191)
	cep = models.CharField(max_length=191)
	ddd = models.CharField(max_length=191, blank=True, null=True)
	id_number = models.CharField(max_length=191, blank=True, null=True)
	document_issue_date = models.DateField()
	emitting_organ = models.CharField(max_length=191, blank=True, null=True)
	email = models.CharField(unique=True, max_length=191)
	mobile = models.IntegerField()
	tier = models.IntegerField()
	fax = models.IntegerField(blank=True, null=True)
	linkedin = models.CharField(max_length=191, blank=True, null=True)
	lattes = models.CharField(max_length=191, blank=True, null=True)
	orcid = models.CharField(max_length=191, blank=True, null=True)
	account_owner = models.CharField(max_length=191, blank=True, null=True)
	address = models.CharField(max_length=191, blank=True, null=True)
	agency = models.CharField(max_length=191, blank=True, null=True)
	bank_address = models.CharField(max_length=191, blank=True, null=True)
	bank_name = models.CharField(max_length=191, blank=True, null=True)
	cnpj = models.CharField(max_length=191, blank=True, null=True)
	company_name = models.CharField(max_length=191, blank=True, null=True)
	cpf = models.CharField(max_length=191, blank=True, null=True)
	iban_account = models.CharField(max_length=191, blank=True, null=True)
	juridical_address = models.CharField(max_length=191, blank=True, null=True)
	national_id = models.CharField(max_length=191, blank=True, null=True)
	juridcal_person = models.BooleanField(null=True, default=False)
	specialty = models.ForeignKey(Specialty, models.CASCADE, blank=True, null=True)
	swift_bic = models.CharField(max_length=191, blank=True, null=True)
	uf_city = models.CharField(max_length=191, blank=True, null=True)
	uf_crm = models.CharField(max_length=191, blank=True, null=True)
	registration_in_city = models.BooleanField(null=True, default=False)
	social_security = models.BooleanField(null=True, default=False)

	deleted_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

	class Meta:
		ordering = ['created_at']
		
class Event(models.Model):
	name = models.CharField(max_length=191)
	_type = models.CharField(max_length=191)
	date = models.DateField()
	duration = models.PositiveIntegerField(blank=True)
	web_presential = models.CharField(max_length=191)
	country = models.CharField(max_length=191, blank=True, null=True)
	state = models.CharField(max_length=191, blank=True, null=True)
	city = models.CharField(max_length=191, blank=True, null=True)
	address = models.CharField(max_length=191, blank=True, null=True)
	solicitant = models.CharField(max_length=191)
	business_unit = models.CharField(max_length=191)
	despartment = models.CharField(max_length=191)
	cost_center = models.CharField(max_length=191)
	speaker = models.ManyToManyField(Speaker, through='account.EventSpeaker')
	virtual_presential = models.CharField(max_length=191)
	displacement = models.CharField(max_length=191)

	deleted_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

	class Meta:
		ordering = ['date']

class EventSpeaker(models.Model):
	duration = models.PositiveIntegerField(blank=True)
	event = models.ForeignKey(Event, on_delete=models.CASCADE)
	role = models.CharField(max_length=191)
	price = models.FloatField(default=0)
	speaker = models.ForeignKey(Speaker, on_delete=models.CASCADE)
	status = models.BooleanField(null=True, default=False)

	created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
	
	class Meta:
		ordering = ['created_at']


class Price(models.Model):
	specialty = models.ForeignKey(Specialty, models.CASCADE, blank=True, null=True)
	tier = models.CharField(max_length=191)
	program_type = models.CharField(max_length=191)
	role = models.CharField(max_length=191)
	factor = models.PositiveIntegerField(blank=True)
	standard_price = models.PositiveIntegerField(blank=True)
	hour_price = models.PositiveIntegerField(blank=True)

	deleted_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

	class Meta:
		ordering = ['role']



