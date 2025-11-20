from rest_framework import serializers
from .models import Venda

class VendaSerializer(serializers.ModelSerializer):
    # Adiciona o nome do cliente e vendedor para exibição
    cliente_nome = serializers.CharField(source='cliente.nome', read_only=True)
    vendedor_nome = serializers.CharField(source='vendedor.nome', read_only=True) 

    class Meta:
        model = Venda
        fields = '__all__'
        read_only_fields = ('id', 'data_venda',)