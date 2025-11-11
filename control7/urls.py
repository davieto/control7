
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
    #Fornecedores
    path('api/', include('apps.fornecedores.urls')),
    #Funcionarios
    path('api/', include('apps.funcionarios.urls')),
    #Produtos
    path('api/', include('apps.produtos.urls')),
    #Configuracao
    path("api/", include("apps.configuracao.urls")),



    #Clientes
    path('api/', include('apps.clientes.urls')),

    #URLs de JWT Auth Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #URLs de documentação
    re_path(r'^swagger/?$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/?$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]