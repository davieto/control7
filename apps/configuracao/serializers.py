from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction

# Importa o model Funcionario
from apps.funcionarios.models import Funcionario 

# Importa Configuração (com fallback)
try:
    from apps.configuracao.models import ConfiguracaoSistema
except ImportError:
    from apps.fornecedores.models import Fornecedor as ConfiguracaoSistema


# --------------------------
# PERFIL DE USUÁRIO
# --------------------------
class UsuarioSerializer(serializers.ModelSerializer):
    # --- AJUSTE IMPORTANTE ---
    # Removemos o campo 'nome' personalizado. 
    # Como o frontend manda 'first_name', usamos o padrão do Django.
    
    # Campos do funcionário (são virtuais, pegam dados da relação)
    cpf = serializers.CharField(source="funcionario.cpf", required=False)
    telefone = serializers.CharField(source="funcionario.telefone", required=False)
    cargo = serializers.CharField(source="funcionario.cargo", required=False)
    nivel_acesso = serializers.CharField(source="funcionario.nivel_acesso", required=False)

    class Meta:
        model = User
        # Adicionamos 'first_name' aqui para aceitar o que vem do React
        fields = ["id", "username", "email", "first_name", "cpf", "telefone", "cargo", "nivel_acesso"]
        read_only_fields = ["id", "username"]

    def update(self, instance, validated_data):
        """
        Atualiza User e sincroniza com Funcionario
        """
        # 1. Separa os dados do funcionário
        funcionario_data = validated_data.pop("funcionario", {})
        
        # 2. Pega os dados do User
        # Como o campo no Meta é 'first_name', o dado vem nesta chave:
        new_nome = validated_data.get("first_name") 
        new_email = validated_data.get("email")

        with transaction.atomic():
            # --- ATUALIZA O USER ---
            
            if new_nome is not None:
                instance.first_name = new_nome # Salva no campo correto do Django

            if new_email and new_email != instance.email:
                if User.objects.filter(username=new_email).exclude(pk=instance.pk).exists():
                    raise serializers.ValidationError({"email": "Este e-mail já está em uso."})
                
                instance.email = new_email
                instance.username = new_email
            
            instance.save()

            # --- ATUALIZA O FUNCIONÁRIO (Sincronia) ---
            if hasattr(instance, "funcionario"):
                funcionario = instance.funcionario
                
                # Atualiza campos extras (CPF, Telefone, etc)
                for attr, value in funcionario_data.items():
                    setattr(funcionario, attr, value)
                
                # Replica o Email e o Nome para a tabela de Funcionários
                if new_email is not None:
                    funcionario.email = new_email
                
                if new_nome is not None:
                    funcionario.nome = new_nome # Aqui sim é .nome (na tabela Funcionario)
                
                funcionario.save()

        return instance


# --------------------------
# ALTERAÇÃO DE SENHA
# --------------------------
class AlterarSenhaSerializer(serializers.Serializer):
    senha_atual = serializers.CharField(required=True, write_only=True)
    nova_senha = serializers.CharField(required=True, write_only=True)
    confirmar_senha = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        # Precisamos do request para saber quem é o usuário
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
             raise serializers.ValidationError("Contexto de requisição inválido.")
             
        user = request.user
        if not user.check_password(data["senha_atual"]):
            raise serializers.ValidationError({"senha_atual": "Senha atual incorreta."})
        if data["nova_senha"] != data["confirmar_senha"]:
            raise serializers.ValidationError({"confirmar_senha": "As senhas não coincidem."})
        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["nova_senha"])
        user.save()
        return user


# --------------------------
# CONFIGURAÇÃO DO SISTEMA
# --------------------------
class ConfiguracaoSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoSistema
        fields = "__all__"