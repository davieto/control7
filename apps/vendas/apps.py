from django.apps import AppConfig

class VendasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.vendas'  # <--- Use o caminho completo aqui!
    label = 'vendas'     # <--- Use o nome curto aqui!
    verbose_name = 'Módulo de Vendas'