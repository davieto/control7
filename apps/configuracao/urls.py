from django.urls import path
from .views import UsuarioView, AlterarSenhaView, FornecedorListCreateView, FornecedorDetailView

urlpatterns = [
    path("configuracoes/usuario/", UsuarioView.as_view(), name="config_usuario"),
    path("configuracoes/senha/", AlterarSenhaView.as_view(), name="config_senha"),
    
    # Configurações do sistema (fornecedores)
    path("configuracoes/fornecedores/", FornecedorListCreateView.as_view(), name="fornecedores_list"),
    path("configuracoes/fornecedores/<int:pk>/", FornecedorDetailView.as_view(), name="fornecedor_detail"),
]
