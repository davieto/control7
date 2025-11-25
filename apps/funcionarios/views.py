from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Import models e serializers
from .models import Funcionario
from .serializers import FuncionarioSerializer

# Import a permissão personalizada que criamos no passo 1
from .permissions import EhAdministrador

class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer

    # --- SEGURANÇA ---
    # Define que para acessar qualquer coisa aqui, o usuário precisa:
    # 1. Estar logado (IsAuthenticated)
    # 2. Ser Administrador (EhAdministrador)
    permission_classes = [IsAuthenticated, EhAdministrador]

    # --- LÓGICA DE DELEÇÃO ---
    def perform_destroy(self, instance):
        """
        Quando deletar um funcionário, deleta também o usuário de login associado.
        """
        # 1. Salva a referência do usuário antes de apagar o funcionário
        user_para_apagar = instance.user

        # 2. Apaga o funcionário do banco
        instance.delete()

        # 3. Se tinha um usuário vinculado, apaga ele agora
        # Isso evita que sobrem usuários "fantasmas" no sistema
        if user_para_apagar:
            user_para_apagar.delete()