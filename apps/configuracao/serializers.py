from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ConfiguracaoSistema

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["nome", "email"]

class AlterarSenhaSerializer(serializers.Serializer):
    senha_atual = serializers.CharField(required=True)
    nova_senha = serializers.CharField(required=True)
    confirmar_senha = serializers.CharField(required=True)

    def validate(self, data):
        request = self.context.get('request')
        if not request:
             raise serializers.ValidationError("Contexto de requisição ausente.")
             
        user = request.user
        
        if not user.check_password(data['senha_atual']):
        
            raise serializers.ValidationError(
                {"senha_atual": "Senha atual incorreta."}
            )
        
        if data['nova_senha'] != data['confirmar_senha']:
          
            raise serializers.ValidationError(
                {"confirmar_senha": "As novas senhas não coincidem."}
            )

        return data

class ConfiguracaoSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoSistema
        fields = "__all__"
