import pytest
from apps.fornecedores.models import Fornecedor
from django.core.exceptions import ValidationError

@pytest.mark.django_db
def test_cria_fornecedor_valido():
    fornecedor = Fornecedor.objects.create(
        nome="Empresa Alpha",
        cnpj="12.345.678/0001-99",
        email="contato@alpha.com"
    )
    assert fornecedor.pk is not None
    assert fornecedor.nome == "Empresa Alpha"

@pytest.mark.django_db
def test_cnpj_invalido_gera_erro():
    from apps.fornecedores.validators import validar_cnpj
    with pytest.raises(ValidationError):
        validar_cnpj("1234")