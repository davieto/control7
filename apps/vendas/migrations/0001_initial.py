# Generated migration for Vendas

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clientes', '0001_initial'),
        ('produtos', '0001_initial'),
        ('funcionarios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Venda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_venda', models.DateTimeField(auto_now_add=True)),
                ('total', models.DecimalField(decimal_places=2, max_digits=12, validators=[django.core.validators.MinValueValidator(0)])),
                ('status', models.CharField(choices=[('pendente', 'Pendente'), ('pago', 'Pago'), ('cancelado', 'Cancelado')], default='pendente', max_length=20)),
                ('forma_pagamento', models.CharField(choices=[('dinheiro', 'Dinheiro'), ('pix', 'PIX'), ('cartao_debito', 'Cartão de Débito'), ('cartao_credito', 'Cartão de Crédito'), ('parcelado', 'Parcelado')], max_length=20)),
                ('observacoes', models.TextField(blank=True, null=True)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vendas', to='clientes.cliente')),
                ('funcionario', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='vendas', to='funcionarios.funcionario')),
            ],
            options={
                'verbose_name': 'Venda',
                'verbose_name_plural': 'Vendas',
                'ordering': ['-data_venda'],
            },
        ),
        migrations.CreateModel(
            name='ItemVenda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantidade', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('preco_unitario', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=12, validators=[django.core.validators.MinValueValidator(0)])),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='produtos.produto')),
                ('venda', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens', to='vendas.venda')),
            ],
            options={
                'verbose_name': 'Item de Venda',
                'verbose_name_plural': 'Itens de Venda',
                'unique_together': {('venda', 'produto')},
            },
        ),
    ]
