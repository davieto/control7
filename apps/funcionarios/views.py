from rest_framework import viewsets
from .models import Funcionario
from .serializers import FuncionarioSerializer

# Django imports para as views HTML
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render, redirect


# --- 🔹 API REST ---
class FuncionarioViewSet(viewsets.ModelViewSet):
    """
    API REST para listar, criar, editar e excluir funcionários.
    """
    queryset = Funcionario.objects.all()
    serializer_class = FuncionarioSerializer


# --- 🔹 VIEWS HTML ---
@login_required
def perfil_view(request):
    """
    Exibe e permite editar o perfil do funcionário logado.
    """
    user = request.user
    funcionario = getattr(user, "funcionario", None)

    if not funcionario:
        messages.error(request, "Nenhum perfil de funcionário associado a este usuário.")
        return redirect("/")

    if request.method == "POST":
        nome = request.POST.get("nome")
        email = request.POST.get("email")
        telefone = request.POST.get("telefone")

        # Atualiza dados no User e Funcionario
        user.email = email
        user.save()

        funcionario.nome = nome
        funcionario.telefone = telefone
        funcionario.save()

        messages.success(request, "Alterações salvas com sucesso!")
        return redirect("perfil")

    return render(request, "funcionarios/perfil.html", {"user": user, "funcionario": funcionario})


@login_required
def alterar_senha_view(request):
    """
    Permite alterar a senha do usuário logado.
    """
    if request.method == "POST":
        senha_atual = request.POST.get("senha_atual")
        nova_senha = request.POST.get("nova_senha")
        confirmar_senha = request.POST.get("confirmar_senha")

        if not request.user.check_password(senha_atual):
            messages.error(request, "Senha atual incorreta.")
            return redirect("alterar_senha")

        if nova_senha != confirmar_senha:
            messages.error(request, "As senhas não coincidem.")
            return redirect("alterar_senha")

        request.user.set_password(nova_senha)
        request.user.save()
        update_session_auth_hash(request, request.user)

        messages.success(request, "Senha alterada com sucesso!")
        return redirect("perfil")

    return render(request, "funcionarios/alterar_senha.html")
