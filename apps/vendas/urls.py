from rest_framework.routers import DefaultRouter
from .views import VendaViewSet, ItemVendaViewSet

router = DefaultRouter()
router.register(r'vendas', VendaViewSet, basename='venda')
router.register(r'itens-venda', ItemVendaViewSet, basename='itemvenda')

urlpatterns = router.urls
