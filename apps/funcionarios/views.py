from rest_framework import viewsets
from .models import Funcionario
from .serializers import FuncionarioSerializer

class FuncionarioViewSet(viewsets.ModelViewSet):
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer

    # --- A MÁGICA ACONTECE AQUI ---
    def perform_destroy(self, instance):
        """
        Quando deletar um funcionário, deleta também o usuário de login associado.
        """
        # 1. Salva a referência do usuário antes de apagar o funcionário
        user_para_apagar = instance.user

        # 2. Apaga o funcionário
        instance.delete()

        # 3. Se tinha um usuário vinculado, apaga ele agora
        if user_para_apagar:
            user_para_apagar.delete()