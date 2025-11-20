# apps/dashboard/views.py

from django.http import JsonResponse
from django.db.models import Sum, Count, F
# REMOVER: from django.contrib.auth.decorators import login_required <--- REMOVIDO
from datetime import datetime, timedelta

# NOVAS IMPORTAÇÕES PARA AUTENTICAÇÃO JWT/DRF
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated 

# IMPORTAR SEUS MODELS (Ajuste o caminho se necessário)
from apps.clientes.models import Cliente
from apps.vendas.models import Venda
from apps.produtos.models import Produto

# 🎯 DECORADORES CORRIGIDOS: Diz ao DRF para usar JWTAuthentication
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_dashboard_data(request):
    
    # ----------------------------------------------------
    # I. CÁLCULO DOS KPIS (Cards Superiores)
    # ----------------------------------------------------
    
    # 1. Receita Total (R$ 0,00)
    receita_qs = Venda.objects.aggregate(total=Sum('valor'))
    receita_total = receita_qs['total'] if receita_qs['total'] else 0.00
    
    # 2. Total de Vendas (+180 vendas)
    total_vendas = Venda.objects.count()
    
    # 3. Total de Clientes (+48 novos clientes)
    total_clientes = Cliente.objects.count()
    
    # ----------------------------------------------------
    # II. CÁLCULO DAS LISTAS (Vendas Recentes / Estoque)
    # ----------------------------------------------------

    # 4. Vendas Recentes (Lista) - LÓGICA MODIFICADA PARA TRATAR NULOS (mantida)
    vendas_qs = Venda.objects.select_related('cliente').order_by('-data_venda')[:5]
    
    lista_vendas_recentes = []
    for venda in vendas_qs:
        
        # Correção: Verifica se o cliente não é nulo antes de acessar 'nome'
        cliente_nome = venda.cliente.nome if venda.cliente else "Cliente Indefinido"
        
        # Correção: Verifica se data_venda não é nula antes de formatar
        hora_formatada = venda.data_venda.strftime("%H:%M") if venda.data_venda else "N/A"
        
        lista_vendas_recentes.append({
            "cliente_nome": cliente_nome,
            "valor": float(venda.valor), 
            "status": venda.get_status_display(), 
            "hora": hora_formatada
        })
        
    # 5. Produtos em Baixo Estoque (Lista)
    # Filtra onde 'estoque' é menor que 'estoque_minimo'
    estoque_qs = Produto.objects.filter(estoque__lt=F('estoque_minimo'))
    
    lista_produtos_estoque = []
    for produto in estoque_qs:
        lista_produtos_estoque.append({
            "nome": produto.descricao,
            "estoque": produto.estoque,
            "minimo": produto.estoque_minimo
        })
        
    # ----------------------------------------------------
    # III. MONTAGEM DO JSON
    # ----------------------------------------------------
    
    dashboard_data = {
        "receita_total": float(receita_total),
        "total_vendas": total_vendas,
        "total_clientes": total_clientes,
        "taxa_crescimento": 0.0,
        
        "vendas_recentes": lista_vendas_recentes,
        "produtos_baixo_estoque": lista_produtos_estoque,
    }
    
    return JsonResponse(dashboard_data)