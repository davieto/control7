from django.db import models

class ConfiguracaoSistema(models.Model):
    nome_empresa = models.CharField(max_length=150)
    cnpj = models.CharField(max_length=18)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    email_corporativo = models.EmailField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nome_empresa
