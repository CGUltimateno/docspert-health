from django.db import models

class Patient(models.Model):
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.full_name

class Consultation(models.Model):
    patient = models.ForeignKey(Patient, related_name='consultations', on_delete=models.CASCADE)
    symptoms = models.TextField()
    diagnosis = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ai_summary = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Consultation for {self.patient.full_name} on {self.created_at.date()}"
