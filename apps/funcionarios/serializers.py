from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction
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

    # Valida email somente para criação
    def validate_email(self, value):
        if self.instance is None:  # Só valida ao criar
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value

    def create(self, validated_data):
        """
        Cria o Funcionario e o User associado, sincronizando nome e email.
        """
        senha = validated_data.pop("senha")
        email = validated_data["email"]
        nome = validated_data.get("nome", "")

        with transaction.atomic():
            # Cria usuário
            user = User.objects.create_user(
                username=email,
                email=email,
                password=senha,
                first_name=nome
            )

            # Cria funcionário associado
            funcionario = Funcionario.objects.create(
                user=user,
                **validated_data
            )

        return funcionario

    def update(self, instance, validated_data):
        """
        Atualiza o Funcionario e sincroniza User (nome, email, senha).
        """
        senha = validated_data.pop("senha", None)
        email = validated_data.get("email", instance.email)
        nome = validated_data.get("nome", instance.nome)

        with transaction.atomic():
            # Atualiza os campos do Funcionario
            instance = super().update(instance, validated_data)

            # Atualiza nome do Funcionario e do User
            if nome:
                instance.nome = nome
                instance.user.first_name = nome

            # Atualiza senha se enviada
            if senha:
                instance.user.set_password(senha)

            # Atualiza email/username se mudou
            if email != instance.user.email:
                if User.objects.filter(username=email).exclude(pk=instance.user.pk).exists():
                    raise serializers.ValidationError({"email": "Este e-mail já está sendo usado por outro usuário."})
                instance.user.email = email
                instance.user.username = email

            instance.user.save()
            instance.save()

        return instance
