from django.urls import path

from .views import UsuarioView, AlterarSenhaView, ConfiguracaoSistemaView

urlpatterns = [
    path("configuracoes/usuario/", UsuarioView.as_view(), name="config_usuario"),
    path("configuracoes/senha/", AlterarSenhaView.as_view(), name="config_senha"),
    path("configuracoes/sistema/", ConfiguracaoSistemaView.as_view(), name="config_sistema"),
]
