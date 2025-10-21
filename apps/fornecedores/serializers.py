from rest_framework import serializers
from .models import Fornecedor

#serializer - transformará o modelo Django em JSON
class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = '__all__'
