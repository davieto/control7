
from rest_framework.routers import DefaultRouter
from .views import FuncionarioViewSet, perfil_view, alterar_senha_view
from django.urls import path

router = DefaultRouter()
router.register(r'funcionarios', FuncionarioViewSet, basename="funcionario")

urlpatterns = [
    path('perfil/', perfil_view, name='perfil'),
    path('alterar-senha/', alterar_senha_view, name='alterar_senha'),
]


urlpatterns += router.urls
