from django.db import models
from django.core.validators import RegexValidator, EmailValidator
from .validators import validar_cnpj


class Fornecedor(models.Model):
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(
        max_length=18,
        unique=True,
        validators=[validar_cnpj],
        help_text="Digite o CNPJ no formato 00.000.000/0000-00"
    )
    contato_comercial = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(
        max_length=100,
        validators=[EmailValidator(message="E-mail inválido.")],
        unique=True
    )
    telefone = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^$?\d{2}$?\s?\d{4,5}-?\d{4}$',
                message="Formato de telefone inválido. Use (XX) XXXXX-XXXX."
            )
        ],
        blank=True,
        null=True
    )
    celular = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^$?\d{2}$?\s?\d{5}-?\d{4}$',
                message="Formato de celular inválido. Use (XX) XXXXX-XXXX."
            )
        ],
        blank=True,
        null=True
    )
    cep = models.CharField(
        max_length=9,
        validators=[
            RegexValidator(
                regex=r'^\d{5}-\d{3}$',
                message="Formato de CEP inválido. Use 00000-000."
            )
        ],
        blank=True,
        null=True
    )
    endereco = models.CharField(max_length=200, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=50, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    uf = models.CharField(max_length=2, blank=True, null=True)

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Fornecedor"
        verbose_name_plural = "Fornecedores"
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.cnpj})"