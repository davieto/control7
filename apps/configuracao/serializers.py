from rest_framework import serializers
from django.contrib.auth.models import User
from apps.fornecedores.models import Fornecedor as ConfiguracaoSistema

# --------------------------
# PERFIL DE USUÁRIO
# --------------------------
# class UsuarioSerializer(serializers.ModelSerializer):
#     nome = serializers.CharField(source="first_name", required=False)

#     class Meta:
#         model = User
#         fields = ["nome", "email"]

#     def update(self, instance, validated_data):
#         """Atualiza o nome e email do usuário"""
#         instance.first_name = validated_data.get("first_name", instance.first_name)
#         instance.email = validated_data.get("email", instance.email)
#         instance.save()
#         return instance
class UsuarioSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source="first_name", required=False)

    class Meta:
        model = User
        fields = ["nome", "email"]

    def update(self, instance, validated_data):
        """Atualiza o nome e email do usuário"""
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
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
        if not request:
            raise serializers.ValidationError("Contexto de requisição ausente.")

        user = request.user

        # Valida senha atual
        if not user.check_password(data["senha_atual"]):
            raise serializers.ValidationError({"senha_atual": "Senha atual incorreta."})

        # Valida confirmação
        if data["nova_senha"] != data["confirmar_senha"]:
            raise serializers.ValidationError({"confirmar_senha": "As senhas não coincidem."})

        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        nova_senha = self.validated_data["nova_senha"]
        user.set_password(nova_senha)
        user.save()
        return user


# --------------------------
# CONFIGURAÇÃO DO SISTEMA
# --------------------------
class ConfiguracaoSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoSistema
        fields = "__all__"
