from rest_framework import viewsets
from .models import Venda, ItemVenda
from .serializers import (
	VendaSerializer,
	VendaCreateUpdateSerializer,
	ItemVendaSerializer,
)


class VendaViewSet(viewsets.ModelViewSet):
	queryset = Venda.objects.select_related('cliente', 'funcionario').prefetch_related('itens')

	def get_serializer_class(self):
		if self.action in ['create', 'update', 'partial_update']:
			return VendaCreateUpdateSerializer
		return VendaSerializer


class ItemVendaViewSet(viewsets.ModelViewSet):
	queryset = ItemVenda.objects.select_related('produto', 'venda').all()
	serializer_class = ItemVendaSerializer
