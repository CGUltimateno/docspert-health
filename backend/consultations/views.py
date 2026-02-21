import os
import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient, Consultation
from .serializers import PatientSerializer, ConsultationSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def get_queryset(self):
        queryset = Consultation.objects.all().order_by('-created_at')
        patient_id = self.request.query_params.get('patient_id')
        if patient_id is not None:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset

    @action(detail=True, methods=['post'], url_path='generate-summary')
    def generate_summary(self, request, pk=None):
        consultation = self.get_object()
        
        symptoms = consultation.symptoms
        diagnosis = consultation.diagnosis or "No diagnosis provided."
        
        api_key = os.getenv('OPENAI_API_KEY')
        
        if api_key:
            try:
                response = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {"role": "system", "content": "You are a medical assistant. Summarize the following consultation notes into a concise clinical summary."},
                            {"role": "user", "content": f"Symptoms: {symptoms}\nDiagnosis: {diagnosis}"}
                        ],
                        "max_tokens": 150
                    },
                )
                if response.status_code == 200:
                    ai_summary = response.json()['choices'][0]['message']['content'].strip()
                else:
                    ai_summary = "Error from AI service"
            except Exception as e:
                print(e)
                ai_summary = "Exception occurred during AI summary generation"
        else:
            ai_summary = f"MOCKED SUMMARY: Patient presented with {symptoms[:50]}... Based on the diagnosis '{diagnosis}', the patient is advised to follow up in two weeks."

        consultation.ai_summary = ai_summary
        consultation.save()
        
        serializer = self.get_serializer(consultation)
        return Response(serializer.data)
