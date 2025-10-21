from django.contrib.auth.models import User
from django.db import models
from django.core.validators import RegexValidator, EmailValidator
from django.core.exceptions import ValidationError
import re

# ✅ Validador CPF
def validar_cpf(cpf):
    cpf = re.sub(r'\D', '', cpf)
    if len(cpf) != 11 or cpf in (c * 11 for c in "0123456789"):
        raise ValidationError("CPF inválido")
    return cpf

# ✅ Definição do modelo
class Funcionario(models.Model):
    NIVEL_ACESSO_CHOICES = [
        ('admin', 'Administrador'),
        ('gerente', 'Gerente'),
        ('vendedor', 'Vendedor'),
        ('financeiro', 'Financeiro'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="funcionario")
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True, validators=[validar_cpf])
    email = models.EmailField(max_length=100, unique=True, validators=[EmailValidator()])
    telefone = models.CharField(max_length=15, blank=True, null=True)
    cargo = models.CharField(max_length=100)
    nivel_acesso = models.CharField(max_length=20, choices=NIVEL_ACESSO_CHOICES)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Funcionário"
        verbose_name_plural = "Funcionários"
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} - {self.cargo}"