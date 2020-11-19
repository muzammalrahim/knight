from django.db import models

class Speaker(models.Model):
	foreign_flag = models.BooleanField(null=True, default=False)
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
	id_number = models.IntegerField(blank=True, null=True)
	document_issue_date = models.DateField()
	emitting_organ = models.CharField(max_length=191, blank=True, null=True)
	email = models.CharField(unique=True, max_length=191)
	mobile = models.IntegerField()
	fax = models.IntegerField(blank=True, null=True)
	linkedin = models.CharField(max_length=191, blank=True, null=True)
	lattes = models.CharField(max_length=191, blank=True, null=True)
	orcid = models.CharField(max_length=191)
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
	duration = models.PositiveIntegerField()
	web_presential = models.CharField(max_length=191)
	country = models.CharField(max_length=191, blank=True, null=True)
	state = models.CharField(max_length=191, blank=True, null=True)
	city = models.CharField(max_length=191, blank=True, null=True)
	address = models.CharField(max_length=191, blank=True, null=True)
	solicitant = models.CharField(max_length=191)
	business_unit = models.CharField(max_length=191)
	despartment = models.CharField(max_length=191)
	cost_center = models.CharField(max_length=191)
	speaker = models.ForeignKey(Speaker, models.DO_NOTHING, blank=True, null=True)
	virtual_presential = models.CharField(max_length=191)
	displacement = models.CharField(max_length=191)

	deleted_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
	updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

	class Meta:
		ordering = ['date']


