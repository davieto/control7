# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, permissions, generics
# from rest_framework.permissions import IsAuthenticated

# from django.contrib.auth.models import User

# # Models
# from apps.fornecedores.models import Fornecedor
# from apps.funcionarios.models import Funcionario

# # Serializers
# from apps.fornecedores.serializers import FornecedorSerializer
# from .serializers import UsuarioSerializer, AlterarSenhaSerializer


# # ============================================================
# # PERFIL DO USUÁRIO (já estava certo, apenas reorganizei)
# # ============================================================
# class UsuarioView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         serializer = UsuarioSerializer(request.user)
#         return Response(serializer.data)

#     def put(self, request):
#         serializer = UsuarioSerializer(
#             request.user,
#             data=request.data,
#             partial=True
#         )
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ============================================================
# # ALTERAR SENHA
# # ============================================================
# class AlterarSenhaView(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self, request):
#         serializer = AlterarSenhaSerializer(
#             data=request.data,
#             context={"request": request}
#         )
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"mensagem": "Senha alterada com sucesso!"})

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # ============================================================
# # CONFIGURAÇÕES DO SISTEMA (FORNECEDORES)
# # 100% REST — lista, cria, edita e deleta vários fornecedores
# # ============================================================

# # LISTAR + CRIAR
# class FornecedorListCreateView(generics.ListCreateAPIView):
#     queryset = Fornecedor.objects.all()
#     serializer_class = FornecedorSerializer
#     permission_classes = [IsAuthenticated]  # troque para AllowAny se quiser liberar


# # BUSCAR + EDITAR + DELETAR
# class FornecedorDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Fornecedor.objects.all()
#     serializer_class = FornecedorSerializer
#     permission_classes = [IsAuthenticated]
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User

# Models
from apps.fornecedores.models import Fornecedor
from apps.funcionarios.models import Funcionario

# Serializers
from apps.fornecedores.serializers import FornecedorSerializer
from .serializers import UsuarioSerializer, AlterarSenhaSerializer


# ============================================================
# PERFIL DO USUÁRIO
# ============================================================
class UsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        print(f"--- Atualizando Usuário: {request.user} ---")
        # partial=True permite atualizar só o nome, só a senha, etc.
        serializer = UsuarioSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        print(f"Erro Validação User: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# ALTERAR SENHA
# ============================================================
class AlterarSenhaView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = AlterarSenhaSerializer(
            data=request.data, 
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"mensagem": "Senha alterada com sucesso!"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# CONFIGURAÇÕES DO SISTEMA (FORNECEDORES)
# ============================================================

# 1. LISTAR (Para o Dropdown) + CRIAR (Novo Fornecedor)
# Rota sugerida: /api/configuracao/fornecedores/
class FornecedorListCreateView(generics.ListCreateAPIView):
    queryset = Fornecedor.objects.all().order_by('nome') # Ordenado por nome ajuda no dropdown
    serializer_class = FornecedorSerializer
    permission_classes = [IsAuthenticated] 


# 2. BUSCAR UM (Detalhes) + EDITAR (Atualizar) + DELETAR
# Rota sugerida: /api/configuracao/fornecedores/<int:pk>/
class FornecedorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fornecedor.objects.all()
    serializer_class = FornecedorSerializer
    permission_classes = [IsAuthenticated]