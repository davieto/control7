from django.urls import path
from .views import ConfiguracoesUsuarioView, ConfiguracoesSenhaView, ConfiguracoesSistemaView

urlpatterns = [
    path("usuario/", ConfiguracoesUsuarioView.as_view(), name="config_usuario"),
    path("senha/", ConfiguracoesSenhaView.as_view(), name="config_senha"),
    path("sistema/", ConfiguracoesSistemaView.as_view(), name="config_sistema"),

]
