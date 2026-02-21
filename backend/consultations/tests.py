from rest_framework.test import APITestCase
from rest_framework import status
from .models import Patient, Consultation

class PatientTests(APITestCase):
    def test_create_patient(self):
        data = {'full_name': 'Test User', 'date_of_birth': '1990-01-01', 'email': 'test@test.com'}
        response = self.client.post('/api/patients/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class ConsultationTests(APITestCase):
    def setUp(self):
        self.patient = Patient.objects.create(full_name="User", date_of_birth="2000-01-01", email="x@x.com")

    def test_create_consultation(self):
        data = {'patient': self.patient.id, 'symptoms': 'headache', 'diagnosis': 'migraine'}
        response = self.client.post('/api/consultations/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_generate_summary_mock(self):
        consultation = Consultation.objects.create(patient=self.patient, symptoms="headache", diagnosis="migraine")
        response = self.client.post(f'/api/consultations/{consultation.id}/generate-summary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
