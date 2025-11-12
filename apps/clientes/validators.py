import re
from django.core.exceptions import ValidationError

def validar_cpf(value):
    """Valida CPF básico (apenas formato e quantidade de dígitos)."""
    cpf = re.sub(r'\D', '', value)

    if len(cpf) != 11:
        raise ValidationError("CPF deve conter 11 dígitos numéricos.")

    # evita CPFs inválidos com todos os dígitos iguais (111.111.111-11)
    if cpf == cpf[0] * 11:
        raise ValidationError("CPF inválido.")

    return value
