from rest_framework import permissions

class EhAdministrador(permissions.BasePermission):
    """
    Permite acesso apenas se o usuário for superuser do Django
    OU se tiver o nivel_acesso = 'admin'/'administrador'.
    """

    def has_permission(self, request, view):
        # 1. Se o usuário não estiver logado, bloqueia
        if not request.user or not request.user.is_authenticated:
            return False

        # 2. Se for superusuário do Django (criado via createsuperuser), libera geral
        if request.user.is_superuser:
            return True

        # 3. Verifica o nível de acesso no perfil do funcionário
        try:
            # O user precisa ter um funcionário vinculado para checar o nível
            if hasattr(request.user, 'funcionario'):
                nivel = request.user.funcionario.nivel_acesso.lower()
                return nivel in ['admin', 'administrador']
            
            return False # Se tem user mas não tem funcionário vinculado, nega
            
        except AttributeError:
            return False