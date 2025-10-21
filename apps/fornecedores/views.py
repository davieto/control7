from rest_framework import viewsets
from .models import Fornecedor
from .serializers import FornecedorSerializer

#view
class FornecedorViewSet(viewsets.ModelViewSet):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer