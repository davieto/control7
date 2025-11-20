from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Venda
from .serializers import VendaSerializer

class VendaViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que as vendas sejam visualizadas ou editadas.
    """
    queryset = Venda.objects.all().order_by('-data_venda')
    serializer_class = VendaSerializer
    permission_classes = [IsAuthenticated]