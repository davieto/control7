from rest_framework import viewsets
from .models import Funcionario
from .serializers import FuncionarioSerializer

# Django imports para as views HTML
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render, redirect


# --- 🔹 API REST ---
class FuncionarioViewSet(viewsets.ModelViewSet):
    """
    API REST para listar, criar, editar e excluir funcionários.
    """
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer
