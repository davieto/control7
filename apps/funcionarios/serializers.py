from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Funcionario


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class FuncionarioSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    senha = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Funcionario
        fields = [
            "id", "nome", "cpf", "email", "telefone",
            "cargo", "nivel_acesso", "senha", "user"
        ]

    def create(self, validated_data):
        senha = validated_data.pop('senha')
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=senha
        )
        func = Funcionario.objects.create(user=user, **validated_data)
        return func

    def update(self, instance, validated_data):
        senha = validated_data.pop('senha', None)
        if senha:
            instance.user.set_password(senha)
            instance.user.save()
        return super().update(instance, validated_data)