from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic import RedirectView  
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# 🎯 IMPORTAÇÕES NECESSÁRIAS PARA O ROUTER
from rest_framework.routers import DefaultRouter
from apps.clientes.views import ClienteViewSet # Supondo que você criou este ViewSet
from apps.vendas.views import VendaViewSet # Supondo que você criou este ViewSet

# 🎯 CONFIGURAÇÃO DO ROUTER
router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'vendas', VendaViewSet, basename='venda')

schema_view = get_schema_view(
    openapi.Info(
        title="Control7 API",
        default_version='v1',
        description="Documentação da API do sistema de vendas",
        contact=openapi.Contact(email="dev@control7.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', RedirectView.as_view(url='swagger/', permanent=False)),
    path('admin/', admin.site.urls),
    
    # 🎯 1. CORREÇÃO PRINCIPAL: Inclui o router com o prefixo 'api/'.
    path('api/', include(router.urls)), 
    
    # 2. As demais rotas que usam o mesmo prefixo 'api/' devem ter o prefixo 'api/' removido do path()
    # E o arquivo de urls interno (do app) DEVE começar com a rota, sem o "api/".

    # Exemplo: Se apps/fornecedores/urls.py contém 'path("fornecedores/", ...)', então use:
    path('api/', include('apps.fornecedores.urls')), # Mantenha por enquanto
    path('api/', include('apps.funcionarios.urls')), # Mantenha por enquanto
    path('api/', include('apps.produtos.urls')), # Mantenha por enquanto
    
    # Dashboard (corrigido para não duplicar o 'api/')
    path('api/dashboard/', include('apps.dashboard.urls')),
    
    # Configuração: Se for uma view específica, pode gerar conflito com path('api/', include(...))
    path("api/", include("apps.configuracao.urls")),
    
    # URLs de JWT Auth Endpoints (mantenha a sintaxe atual)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # URLs de documentação
    re_path(r'^swagger/?$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/?$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]