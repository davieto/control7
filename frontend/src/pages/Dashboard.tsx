import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { Sidebar } from "@/components/layout/Sidebar"; // Sem chaves!
import { Header } from "@/components/layout/Header";   // Sem chaves!
// ... (outros imports) ...
import { apiFetch } from "@/lib/api";

// ⚠️ Definição do tipo de dado que o Backend retorna (opcional, mas recomendado em TS)
interface DashboardData {
  receita_total: number;
  total_vendas: number;
  total_clientes: number;
  taxa_crescimento: number; // Assumindo que o backend devolverá um número
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
  // 1. NOVO ESTADO: Usaremos um objeto para armazenar a resposta completa da API
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Remova os estados individuais estáticos, ou ajuste-os para serem computados
  // (Vamos usar 'data' diretamente para simplificar o código abaixo)

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // 🚀 CHAMADA ÚNICA PARA O ENDPOINT DO DJANGO QUE CRIAMOS!
        // O endpoint completo é /api/dashboard/data/, mas o 'apiFetch' deve gerenciar o prefixo 'api/'.
        const response: DashboardData = await apiFetch("/dashboard/data/");
        
        setData(response); // Armazena todos os dados de uma vez
      
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // 3. Renderização de Loading (Melhoria de UX)
  if (loading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-xl text-primary">Carregando dados da Dashboard...</p>
        </div>
    );
  }
  
  // Garante que a aplicação não quebre se houver erro e o 'data' for nulo
  if (!data) {
      return (
          <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-xl text-red-500">Falha ao carregar dados. Verifique a conexão com a API.</p>
          </div>
      );
  }

  // 4. Formatação dos Dados (Usamos o 'data' para formatar no retorno)
  // Nota: Assumimos que o campo 'taxa_crescimento' no Django está em formato de número (ex: 2.5)

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
            // ⭐️ Troca do estado estático pelo dado da API
            value={`R$ ${data.receita_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            change="+20.1% em relação ao mês passado" // <-- Manter estático por agora
            icon={DollarSign}
            variant="primary"
            trend="up"
          />
          {/* Vendas */}
          <MetricCard
            title="Vendas"
            // ⭐️ Troca do estado estático pelo dado da API
            value={data.total_vendas.toString()}
            change="+180 vendas este mês" // <-- Manter estático por agora
            icon={ShoppingCart}
            variant="success"
            trend="up"
          />
          {/* Clientes */}
          <MetricCard
            title="Clientes"
            // ⭐️ Troca do estado estático pelo dado da API
            value={data.total_clientes.toString()}
            change="+48 novos clientes" // <-- Manter estático por agora
            icon={Users}
            trend="up"
          />
          {/* Taxa de Crescimento */}
          <MetricCard
            title="Taxa de Crescimento"
            // ⭐️ Troca do estado estático pelo dado da API
            value={`${data.taxa_crescimento}%`} 
            change="+2.5% em relação ao trimestre" // <-- Manter estático por agora
            icon={TrendingUp}
            variant="warning"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ⚠️ Nota: O componente <RecentSales /> precisa ser modificado 
              para aceitar a prop 'vendas' (data.vendas_recentes)
          */}
          <RecentSales vendas={data.vendas_recentes} />
          
          <div className="bg-card rounded-xl shadow-medium p-6 border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">Produtos em Baixo Estoque</h3>
            <div className="space-y-3">
              {/* ⭐️ Renderiza a lista vinda da API */}
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