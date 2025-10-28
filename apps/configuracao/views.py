from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import ConfiguracaoSistema
from .serializers import (
    UsuarioSerializer,
    AlterarSenhaSerializer,
    ConfiguracaoSistemaSerializer,
)

class ConfiguracoesUsuarioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UsuarioSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Perfil atualizado com sucesso!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfiguracoesSenhaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = AlterarSenhaSerializer(data=request.data)
        if serializer.is_valid():
            senha_atual = serializer.validated_data["senha_atual"]
            nova_senha = serializer.validated_data["nova_senha"]
            confirmar_senha = serializer.validated_data["confirmar_senha"]

            user = request.user

            if not user.check_password(senha_atual):
                return Response({"error": "Senha atual incorreta."}, status=400)

            if nova_senha != confirmar_senha:
                return Response({"error": "As senhas não coincidem."}, status=400)

            user.set_password(nova_senha)
            user.save()
            return Response({"message": "Senha alterada com sucesso!"})
        return Response(serializer.errors, status=400)


class ConfiguracoesSistemaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        config, _ = ConfiguracaoSistema.objects.get_or_create(id=1)
        serializer = ConfiguracaoSistemaSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Configurações do sistema salvas!"})
        return Response(serializer.errors, status=400)
