import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { Sidebar } from "@/components/layout/Sidebar"; 
import { Header } from "@/components/layout/Header";   
// ... (outros imports) ...
import { apiFetch } from "@/lib/api";

// ⚠️ Definição do tipo de dado que o Backend retorna (opcional, mas recomendado em TS)
interface DashboardData {
  receita_total: number;
  total_vendas: number;
  total_clientes: number;
  taxa_crescimento: number;
  
  // Mantendo os campos dinâmicos que preparamos
  novos_clientes_mes: number; 
  crescimento_trimestral: number; 

  vendas_recentes: {
    id: number;
    cliente_nome: string;
    valor: number;
    status: string;
    data_formatada: string;
  }[];
  produtos_baixo_estoque: {
    nome: string;
    estoque: number;
    minimo: number;
  }[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const response: DashboardData = await apiFetch("/dashboard/data/");
        
        // 💡 MOCK DATA: Mantendo os mocks para garantir que o TS não quebre,
        // mas as strings de "change" foram removidas abaixo.
        const mockData = { 
            ...response, 
            novos_clientes_mes: 48,
            crescimento_trimestral: 2.5, 
        }; 
        
        setData(mockData);
      
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-xl text-primary">Carregando dados da Dashboard...</p>
        </div>
    );
  }
  
  if (!data) {
      return (
          <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-xl text-red-500">Falha ao carregar dados. Verifique a conexão com a API.</p>
          </div>
      );
  }

  // O restante do componente usa 'data' diretamente:
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Receita Total */}
          <MetricCard
            title="Receita Total"
            value={`R$ ${data.receita_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            change="" // ❌ REMOVIDO: "+20.1% em relação ao mês passado"
            icon={DollarSign}
            variant="primary"
            trend="up"
          />
          {/* Vendas */}
          <MetricCard
            title="Vendas"
            value={data.total_vendas.toString()}
            change="" // ❌ REMOVIDO: "+180 vendas este mês"
            icon={ShoppingCart}
            variant="success"
            trend="up"
          />
          {/* Clientes */}
          <MetricCard
            title="Clientes"
            value={data.total_clientes.toString()}
            
            // ❌ REMOVIDO: "+48 novos clientes" e dinâmico, agora vazio.
            change="" 
            
            icon={Users}
            trend="up"
          />
          {/* Taxa de Crescimento */}
          <MetricCard
            title="Taxa de Crescimento"
            value={`${data.taxa_crescimento}%`} 
            
            // ❌ REMOVIDO: "+2.5% em relação ao trimestre" e dinâmico, agora vazio.
            change="" 
            
            icon={TrendingUp}
            variant="warning"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas Recentes */}
          <RecentSales vendas={data.vendas_recentes} />
          
          <div className="bg-card rounded-xl shadow-medium p-6 border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">Produtos em Baixo Estoque</h3>
            <div className="space-y-3">
              {data.produtos_baixo_estoque.length > 0 ? (
                data.produtos_baixo_estoque.map((produto, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <span className="font-medium text-foreground">{produto.nome}</span>
                    <span className="text-sm font-semibold text-warning">
                        {produto.estoque} de {produto.minimo} unidades
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum produto em baixo estoque</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;