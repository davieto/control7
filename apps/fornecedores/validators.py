import re
from django.core.exceptions import ValidationError

#validators - validar cnpj
def validar_cnpj(cnpj: str):
    cnpj = re.sub(r'\D', '', cnpj)
    if len(cnpj) != 14:
        raise ValidationError('CNPJ deve ter 14 dígitos.')

    # Validação simplificada de CNPJ
    if cnpj in (c * 14 for c in "1234567890"):
        raise ValidationError('CNPJ inválido.')

    return cnpj

