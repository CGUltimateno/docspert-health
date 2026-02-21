from django.contrib import admin
from .models import Patient, Consultation

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'date_of_birth')
    search_fields = ('full_name', 'email')

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'created_at', 'ai_summary_short')
    list_filter = ('created_at', 'patient')
    
    def ai_summary_short(self, obj):
        return (obj.ai_summary[:50] + '...') if obj.ai_summary else "No summary"
    ai_summary_short.short_description = "AI Summary"
