from django.urls import path
from . import views

urlpatterns = [
    # CORREÇÃO: Usa apenas a parte final da URL para evitar duplicação.
    # A URL completa será: /api/dashboard/data/
    path('data/', views.api_dashboard_data, name='api_dashboard_data'),
]