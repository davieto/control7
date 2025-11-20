# apps/vendas/models.py

from django.db import models
from apps.clientes.models import Cliente
from apps.funcionarios.models import Funcionario

class Venda(models.Model):
    # Campos que o Dashboard usa
    
    STATUS_CHOICES = [
        ('PAGO', 'Pago'),
        ('PENDENTE', 'Pendente'),
        ('CANCELADO', 'Cancelado'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="vendas")
    vendedor = models.ForeignKey(Funcionario, on_delete=models.SET_NULL, null=True, blank=True)
    
    valor = models.DecimalField(max_digits=10, decimal_places=2) # Para Receita Total
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PAGO')
    data_venda = models.DateTimeField(auto_now_add=True) # Para Vendas Recentes
    
    # ... outros campos ...

    def __str__(self):
        return f"Venda {self.id} - R$ {self.valor}"

# Lembre-se de rodar 'python manage.py makemigrations' e 'python manage.py migrate' após criar ou alterar models!