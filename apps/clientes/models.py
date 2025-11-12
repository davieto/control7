from django.db import models
from django.core.validators import EmailValidator
from .validators import validar_cpf


class Cliente(models.Model):
    nome = models.CharField(max_length=100)

    cpf = models.CharField(
        max_length=18,
        unique=True,
        validators=[validar_cpf],
        help_text="Digite o CPF no formato 000.000.000-00"
    )

    contato_comercial = models.CharField(max_length=100, blank=True, null=True)

    email = models.EmailField(
        max_length=100,
        validators=[EmailValidator(message="E-mail inválido.")],
        unique=True
    )

    telefone = models.CharField(max_length=15, blank=True, null=True)
    celular = models.CharField(max_length=15, blank=True, null=True)
    cep = models.CharField(max_length=9, blank=True, null=True)
    endereco = models.CharField(max_length=200, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=50, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    uf = models.CharField(max_length=2, blank=True, null=True)

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        ordering = ["nome"]

    def __str__(self):
        return self.nome
