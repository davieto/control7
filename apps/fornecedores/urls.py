from rest_framework.routers import DefaultRouter
from .views import FornecedorViewSet

#url
router = DefaultRouter()
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')

urlpatterns = router.urls