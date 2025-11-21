from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction

# Importa o model Funcionario
# (Usamos try/except para evitar erros de importação circular se houver)
try:
    from apps.funcionarios.models import Funcionario
except ImportError:
    Funcionario = None

# Importa Configuração (com fallback)
try:
    from apps.configuracao.models import ConfiguracaoSistema
except ImportError:
    from apps.fornecedores.models import Fornecedor as ConfiguracaoSistema


# --------------------------
# PERFIL DE USUÁRIO (CORRIGIDO PARA ADMIN)
# --------------------------
class UsuarioSerializer(serializers.ModelSerializer):
    # --- CORREÇÃO: Usamos MethodField para detectar Superusuário ---
    cargo = serializers.SerializerMethodField()
    nivel_acesso = serializers.SerializerMethodField()

    # Campos do funcionário (apenas visualização ou via update)
    cpf = serializers.CharField(source="funcionario.cpf", required=False, read_only=True)
    telefone = serializers.CharField(source="funcionario.telefone", required=False, read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "cpf", "telefone", "cargo", "nivel_acesso"]
        read_only_fields = ["id", "username"]

    # 1. Lógica para liberar menu para o Admin
    def get_nivel_acesso(self, obj):
        if obj.is_superuser:
            return "Administrador"  # <--- Isso libera a Sidebar
        
        if hasattr(obj, 'funcionario'):
            return obj.funcionario.nivel_acesso
        
        return "Vendedor"

    # 2. Lógica para mostrar cargo correto
    def get_cargo(self, obj):
        if obj.is_superuser:
            return "Superusuário"
            
        if hasattr(obj, 'funcionario'):
            return obj.funcionario.cargo
            
        return "Usuário"

    def update(self, instance, validated_data):
        """
        Atualiza User e sincroniza com Funcionario (se existir)
        """
        # 1. Separa os dados do funcionário
        funcionario_data = validated_data.pop("funcionario", {})
        
        # 2. Pega os dados do User
        new_nome = validated_data.get("first_name") 
        new_email = validated_data.get("email")

        with transaction.atomic():
            # --- ATUALIZA O USER ---
            if new_nome is not None:
                instance.first_name = new_nome

            if new_email and new_email != instance.email:
                if User.objects.filter(username=new_email).exclude(pk=instance.pk).exists():
                    raise serializers.ValidationError({"email": "Este e-mail já está em uso."})
                
                instance.email = new_email
                instance.username = new_email
            
            instance.save()

            # --- ATUALIZA O FUNCIONÁRIO (Sincronia) ---
            # Só tenta atualizar funcionário se o usuário TIVER um vinculado
            if hasattr(instance, "funcionario"):
                funcionario = instance.funcionario
                
                # Atualiza campos extras (CPF, Telefone, etc) se vierem no payload
                # (Nota: Como definimos read_only=True lá em cima, eles podem não vir no validated_data, 
                # mas mantemos a lógica caso você mude isso depois)
                for attr, value in funcionario_data.items():
                    setattr(funcionario, attr, value)
                
                # Replica o Email e o Nome para a tabela de Funcionários
                if new_email is not None:
                    funcionario.email = new_email
                
                if new_nome is not None:
                    funcionario.nome = new_nome
                
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
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
             raise serializers.ValidationError("Contexto de requisição inválido.")
             
        user = request.user

        # 1. Valida senha atual
        if not user.check_password(data["senha_atual"]):
            raise serializers.ValidationError({"senha_atual": "Senha atual incorreta."})
        
        # 2. Valida tamanho (Segurança)
        if len(data["nova_senha"]) < 6:
            raise serializers.ValidationError({"nova_senha": "A senha deve ter no mínimo 6 caracteres."})

        # 3. Valida confirmação
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