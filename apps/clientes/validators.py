import re
from django.core.exceptions import ValidationError

def validar_cnpj(value):
    pattern = r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$'
    if not re.match(pattern, value):
        raise ValidationError("CNPJ inválido. Use o formato 00.000.000/0000-00.")