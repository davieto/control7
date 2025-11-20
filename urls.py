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
    
    # 🎯 ROTAS DO DRF ROUTER: Inclui /api/clientes/ e /api/vendas/
    path('api/', include(router.urls)), 
    
    # Fornecedores (Se eles usarem views.py e urls.py separados, mantenha. Se for ViewSet, remova a linha abaixo e adicione ao router)
    path('api/', include('apps.fornecedores.urls')),
    # Funcionarios
    path('api/', include('apps.funcionarios.urls')),
    # Produtos
    path('api/', include('apps.produtos.urls')),
    # Configuracao
    path("api/", include("apps.configuracao.urls")),
    
    # Dashboard
    path('api/dashboard/', include('apps.dashboard.urls')),

    # URLs de JWT Auth Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # URLs de documentação
    re_path(r'^swagger/?$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/?$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]