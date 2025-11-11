from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User

from apps.fornecedores.models import Fornecedor
from apps.fornecedores.serializers import FornecedorSerializer

from .serializers import UsuarioSerializer, AlterarSenhaSerializer  # seus serializers já criados


class UsuarioView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AlterarSenhaView(APIView):
    permission_classes = [permissions.AllowAny]

    def put(self, request):
        serializer = AlterarSenhaSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["nova_senha"])
            user.save()
            return Response({"mensagem": "Senha alterada com sucesso!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfiguracaoSistemaView(APIView):
    """
    Atualiza os dados "de sistema" que estão salvos no model Fornecedor.
    Recomendação: escolha um registro Fornecedor que represente sua empresa (ex: fornecedor.id == X).
    A API aceita o campo 'fornecedor_id' no body. Se não enviado, usa o primeiro Fornecedor().
    """

    permission_classes = [permissions.AllowAny]

    def get_fornecedor(self, fornecedor_id=None):
        if fornecedor_id:
            try:
                return Fornecedor.objects.get(id=fornecedor_id)
            except Fornecedor.DoesNotExist:
                return None
        return Fornecedor.objects.first()

    def get(self, request):
        fornecedor_id = request.query_params.get("fornecedor_id")
        fornecedor = self.get_fornecedor(fornecedor_id)
        if not fornecedor:
            return Response({"erro": "Fornecedor não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        serializer = FornecedorSerializer(fornecedor)
        return Response(serializer.data)

    def put(self, request):
        fornecedor_id = request.data.get("fornecedor_id")
        fornecedor = self.get_fornecedor(fornecedor_id)
        if not fornecedor:
            return Response({"erro": "Fornecedor não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # atualiza qualquer campo válido do Fornecedor (o serializer usa fields='__all__')
        serializer = FornecedorSerializer(fornecedor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensagem": "Configurações do sistema atualizadas com sucesso!", "fornecedor": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
