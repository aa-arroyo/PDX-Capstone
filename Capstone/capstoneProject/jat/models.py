from django.db import models
import datetime
from django.utils.timezone import datetime
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE



# Create your models here.
class NewApplication(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, null=True, blank=True)
    job_title = models.CharField(max_length=30, default='')
    company_name = models.CharField(max_length=30, default='')
    date_applied = models.DateField(default= datetime.now)
    compensation_type = models.CharField(max_length=30, default='')
    compensation_amount = models.IntegerField(default = 0)
    type_of_hire = models.CharField(max_length=30, default='')
    shift = models.CharField(max_length=30, default='')
    status = models.CharField(max_length=30, default='')
    notes = models.TextField()
    favorite = models.CharField(max_length=10,default= '')

    def __str__(self):
        return f'{self.job_title} - {self.user}'