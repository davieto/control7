from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from control7.apps.clientes.models import Cliente

class ClienteTests(APITestCase):
    def setUp(self):
        self.cliente_data = {
            "nome": "Cliente Teste",
            "cnpj": "12.345.678/0001-90",
            "email": "teste@cliente.com"
        }

    def test_criar_cliente(self):
        url = reverse('cliente-list')
        response = self.client.post(url, self.cliente_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cliente.objects.count(), 1)
        self.assertEqual(Cliente.objects.get().nome, 'Cliente Teste')