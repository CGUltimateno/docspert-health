from rest_framework import serializers
from .models import Patient, Consultation

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.full_name')

    class Meta:
        model = Consultation
        fields = ['id', 'patient', 'patient_name', 'symptoms', 'diagnosis', 'created_at', 'ai_summary']
        read_only_fields = ['created_at', 'ai_summary']
