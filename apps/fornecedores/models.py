from django.db import models
from .validators import validar_cnpj

class Fornecedor(models.Model):
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(
        max_length=18,
        unique=True,
        validators=[validar_cnpj]
    )
    telefone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    endereco = models.CharField(max_length=200, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.nome} ({self.cnpj})'