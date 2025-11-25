from rest_framework import serializers
from .models import Produto

class ProdutoSerializer(serializers.ModelSerializer):
    fornecedor_nome = serializers.CharField(source='fornecedor.nome', read_only=True)

    class Meta:
        model = Produto
        fields = [
            'id', 'descricao', 'codigo', 'preco', 'estoque', 'estoque_minimo',
            'unidade_medida', 'fornecedor', 'fornecedor_nome',
            'criado_em', 'atualizado_em'
        ]