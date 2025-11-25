from django.contrib import admin
from .models import Venda, ItemVenda


class ItemVendaInline(admin.TabularInline):
	model = ItemVenda
	extra = 0
	readonly_fields = ('subtotal', 'criado_em')
	fields = ('produto', 'quantidade', 'preco_unitario', 'subtotal', 'criado_em')


@admin.register(Venda)
class VendaAdmin(admin.ModelAdmin):
	list_display = ('id', 'cliente', 'funcionario', 'data_venda', 'total', 'status', 'forma_pagamento')
	list_filter = ('status', 'forma_pagamento', 'data_venda')
	search_fields = ('cliente__nome', 'funcionario__nome', 'id')
	readonly_fields = ('data_venda', 'criado_em', 'atualizado_em', 'total')
	inlines = [ItemVendaInline]


@admin.register(ItemVenda)
class ItemVendaAdmin(admin.ModelAdmin):
	list_display = ('id', 'venda', 'produto', 'quantidade', 'preco_unitario', 'subtotal')
	list_filter = ('criado_em', 'venda__status')
	search_fields = ('venda__id', 'produto__descricao')
	readonly_fields = ('subtotal', 'criado_em')
