from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

# Imports dos Models e Serializers
# Ajuste os caminhos se necessário, baseado na sua estrutura de pastas
from apps.fornecedores.models import Fornecedor
from apps.fornecedores.serializers import FornecedorSerializer
from .serializers import UsuarioSerializer, AlterarSenhaSerializer

class UsuarioView(APIView):
    """
    Gerencia a leitura e atualização do perfil do usuário logado.
    Sincroniza automaticamente com a tabela de Funcionários via Serializer.
    """
    # OBRIGATÓRIO: Garante que só usuários logados acessem
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        # --- ÁREA DE DEBUG (Olhe no seu terminal) ---
        print("\n=== DEBUG: ATUALIZANDO PERFIL ===")
        print(f"Usuário Logado: {request.user.email} (ID: {request.user.id})")
        print(f"Dados recebidos do Frontend: {request.data}")
        # --------------------------------------------

        # Passamos partial=True para permitir atualizar só o nome ou só a senha, etc.
        serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            try:
                serializer.save()
                print("✅ Sucesso: Perfil atualizado!")
                return Response(serializer.data)
            except Exception as e:
                print(f"❌ Erro crítico ao salvar: {e}")
                return Response({"erro": "Erro interno ao salvar dados."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print(f"⚠️ Erro de Validação: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AlterarSenhaView(APIView):
    """
    Permite a alteração de senha exigindo a senha atual.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # Passamos o request no context para o serializer validar a senha atual do user
        serializer = AlterarSenhaSerializer(data=request.data, context={"request": request})
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["nova_senha"])
            user.save()
            
            # É boa prática manter o usuário logado ou retornar token novo, 
            # mas aqui retornamos apenas sucesso.
            return Response({"mensagem": "Senha alterada com sucesso!"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfiguracaoSistemaView(APIView):
    """
    Atualiza os dados da empresa/sistema (Model Fornecedor).
    """
    permission_classes = [permissions.AllowAny] # Pode alterar para IsAuthenticated se quiser restringir

    def get_fornecedor(self, fornecedor_id=None):
        # Tenta pegar pelo ID enviado ou pega o primeiro do banco
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
            return Response({"erro": "Nenhuma configuração encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = FornecedorSerializer(fornecedor)
        return Response(serializer.data)

    def put(self, request):
        fornecedor_id = request.data.get("fornecedor_id")
        fornecedor = self.get_fornecedor(fornecedor_id)
        
        if not fornecedor:
            return Response({"erro": "Configuração não encontrada para edição."}, status=status.HTTP_404_NOT_FOUND)

        serializer = FornecedorSerializer(fornecedor, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "mensagem": "Configurações atualizadas!",
                "dados": serializer.data
            })
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)