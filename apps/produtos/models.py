from django.db import models
from django.core.validators import MinValueValidator
from apps.fornecedores.models import Fornecedor


class Produto(models.Model):
    UNIDADES = [
        ('UN', 'Unidade'),
        ('CX', 'Caixa'),
        ('PC', 'Peça'),
        ('KG', 'Quilograma'),
        ('MT', 'Metro'),
        ('LT', 'Litro'),
    ]

    descricao = models.CharField(max_length=200)
    codigo = models.CharField(max_length=50, unique=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    estoque = models.PositiveIntegerField(default=0)
    estoque_minimo = models.PositiveIntegerField(default=0)
    unidade_medida = models.CharField(max_length=2, choices=UNIDADES)
    fornecedor = models.ForeignKey(Fornecedor, on_delete=models.PROTECT, related_name="produtos")
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['descricao']
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'

    def __str__(self):
        return f'{self.descricao} ({self.codigo})'