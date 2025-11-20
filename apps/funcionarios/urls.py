from rest_framework.routers import DefaultRouter
from .views import FuncionarioViewSet

router = DefaultRouter()
router.register(r'funcionarios', FuncionarioViewSet, basename="funcionario")

urlpatterns = router.urls
