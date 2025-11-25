from rest_framework import serializers
from .models import Venda, ItemVenda
from apps.clientes.serializers import ClienteSerializer
from apps.produtos.serializers import ProdutoSerializer
from apps.funcionarios.serializers import FuncionarioSerializer
from django.db import transaction
from django.db.models import F
from rest_framework.exceptions import ValidationError


class ItemVendaSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)
    produto_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ItemVenda
        fields = ['id', 'produto', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal', 'criado_em']
        read_only_fields = ['id', 'preco_unitario', 'subtotal', 'criado_em']


class VendaSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    funcionario = FuncionarioSerializer(read_only=True)
    cliente_id = serializers.IntegerField(write_only=True)
    funcionario_id = serializers.IntegerField(write_only=True)
    itens = ItemVendaSerializer(many=True, read_only=True)

    class Meta:
        model = Venda
        fields = [
            'id', 'cliente', 'cliente_id', 'funcionario', 'funcionario_id', 'data_venda',
            'total', 'status', 'forma_pagamento', 'observacoes', 'itens',
            'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'data_venda', 'criado_em', 'atualizado_em', 'total']


class VendaCreateUpdateSerializer(serializers.ModelSerializer):
    itens = ItemVendaSerializer(many=True, write_only=True)

    class Meta:
        model = Venda
        fields = [
            'cliente_id', 'funcionario_id', 'status', 'forma_pagamento',
            'observacoes', 'itens'
        ]

    def create(self, validated_data):
        # debug prints removed

        itens_data = validated_data.pop('itens', [])

        # Also inspect raw input (initial_data) because front-end may send keys
        # that are not present in validated_data (e.g. 'cliente' or camelCase keys).
        raw = getattr(self, 'initial_data', {}) or {}

        # Accept either 'cliente_id' or 'cliente' from frontend (validated_data preferred)
        cliente_id = validated_data.pop('cliente_id', None)
        if cliente_id is None:
            cliente_id = validated_data.pop('cliente', None)
        if cliente_id is None:
            # fallback to raw request body
            cliente_id = raw.get('cliente') or raw.get('cliente_id')

        # Coerce cliente_id if frontend provided an object/dict
        if isinstance(cliente_id, dict):
            cliente_id = cliente_id.get('id')
        if hasattr(cliente_id, 'id'):
            try:
                cliente_id = int(getattr(cliente_id, 'id'))
            except Exception:
                cliente_id = None
        # try convert string/number to int
        if cliente_id is not None:
            try:
                cliente_id = int(cliente_id)
            except Exception:
                cliente_id = None

        # Accept either 'funcionario_id' or 'funcionario'
        funcionario_id = validated_data.pop('funcionario_id', None)
        if funcionario_id is None:
            funcionario_id = validated_data.pop('funcionario', None)
        if funcionario_id is None:
            funcionario_id = raw.get('funcionario') or raw.get('funcionario_id')

        # Coerce funcionario_id if frontend provided an object/dict
        if isinstance(funcionario_id, dict):
            funcionario_id = funcionario_id.get('id')
        if hasattr(funcionario_id, 'id'):
            try:
                funcionario_id = int(getattr(funcionario_id, 'id'))
            except Exception:
                funcionario_id = None

        # If still missing, attempt to infer from the authenticated user
        if funcionario_id is None:
            request = self.context.get('request')
            if request and hasattr(request, 'user') and hasattr(request.user, 'funcionario'):
                try:
                    funcionario_id = int(request.user.funcionario.id)
                except Exception:
                    funcionario_id = None
        else:
            # try convert string/number to int
            try:
                funcionario_id = int(funcionario_id)
            except Exception:
                pass

        # Accept camelCase 'formaPagamento' or snake_case 'forma_pagamento'
        if 'formaPagamento' in raw and 'forma_pagamento' not in validated_data:
            validated_data['forma_pagamento'] = raw.get('formaPagamento')

        if not itens_data:
            raise ValidationError({'itens': 'A venda precisa conter ao menos um item.'})

        if cliente_id is None:
            raise ValidationError({'cliente_id': 'Este campo é obrigatório.'})

        from apps.produtos.models import Produto

        total = 0
        errors = []

        # Validate items first
        for idx, item_data in enumerate(itens_data):
            produto_id = item_data.get('produto_id')
            quantidade = item_data.get('quantidade', 1)
            try:
                produto = Produto.objects.get(id=produto_id)
            except Produto.DoesNotExist:
                errors.append({ 'index': idx, 'produto_id': f'Produto {produto_id} não encontrado.' })
                continue

            if quantidade <= 0:
                errors.append({ 'index': idx, 'quantidade': 'Quantidade deve ser maior que zero.' })
                continue

            # optional: check estoque if model exposes it
            if hasattr(produto, 'estoque') and quantidade > getattr(produto, 'estoque'):
                errors.append({ 'index': idx, 'estoque': f'Estoque insuficiente para o produto {produto_id}.' })
                continue

            total += float(produto.preco) * int(quantidade)

        if errors:
            raise ValidationError({'itens': errors})

        # Everything validated: create venda and itens atomically
        with transaction.atomic():
            # include total at creation to satisfy non-null DB constraint
            venda = Venda.objects.create(cliente_id=cliente_id, funcionario_id=funcionario_id, total=total, **validated_data)
            for item_data in itens_data:
                produto_id = item_data.get('produto_id')
                quantidade = item_data.get('quantidade', 1)
                produto = Produto.objects.get(id=produto_id)
                item = ItemVenda.objects.create(
                    venda=venda,
                    produto=produto,
                    quantidade=quantidade,
                    preco_unitario=produto.preco,
                )
                # decrement stock atomically
                Produto.objects.filter(id=produto_id).update(estoque=F('estoque') - int(quantidade))
            venda.total = total
            venda.save()

        return venda

    def update(self, instance, validated_data):
        itens_data = validated_data.pop('itens', None)

        from apps.produtos.models import Produto

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if itens_data is not None:
            if not itens_data:
                raise ValidationError({'itens': 'A venda precisa conter ao menos um item.'})

            total = 0
            errors = []
            for idx, item_data in enumerate(itens_data):
                produto_id = item_data.get('produto_id')
                quantidade = item_data.get('quantidade', 1)
                try:
                    produto = Produto.objects.get(id=produto_id)
                except Produto.DoesNotExist:
                    errors.append({ 'index': idx, 'produto_id': f'Produto {produto_id} não encontrado.' })
                    continue

                if quantidade <= 0:
                    errors.append({ 'index': idx, 'quantidade': 'Quantidade deve ser maior que zero.' })
                    continue

                if hasattr(produto, 'estoque') and quantidade > getattr(produto, 'estoque'):
                    errors.append({ 'index': idx, 'estoque': f'Estoque insuficiente para o produto {produto_id}.' })
                    continue

                total += float(produto.preco) * int(quantidade)

            if errors:
                raise ValidationError({'itens': errors})

            # update atomically
            with transaction.atomic():
                # restore stock from existing items
                for existing in instance.itens.all():
                    Produto.objects.filter(id=existing.produto_id).update(estoque=F('estoque') + int(existing.quantidade))

                # remove old items and create new ones, adjusting stock
                instance.itens.all().delete()
                for item_data in itens_data:
                    produto_id = item_data.get('produto_id')
                    quantidade = item_data.get('quantidade', 1)
                    produto = Produto.objects.get(id=produto_id)
                    ItemVenda.objects.create(
                        venda=instance,
                        produto=produto,
                        quantidade=quantidade,
                        preco_unitario=produto.preco,
                    )
                    Produto.objects.filter(id=produto_id).update(estoque=F('estoque') - int(quantidade))
                instance.total = total

        instance.save()
        return instance
