import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const Dashboard = () => {
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
          <MetricCard
            title="Receita Total"
            value="R$ 45.231,89"
            change="+20.1% em relação ao mês passado"
            icon={DollarSign}
            variant="primary"
            trend="up"
          />
          <MetricCard
            title="Vendas"
            value="2.350"
            change="+180 vendas este mês"
            icon={ShoppingCart}
            variant="success"
            trend="up"
          />
          <MetricCard
            title="Clientes"
            value="1.254"
            change="+48 novos clientes"
            icon={Users}
            trend="up"
          />
          <MetricCard
            title="Taxa de Crescimento"
            value="12.5%"
            change="+2.5% em relação ao trimestre"
            icon={TrendingUp}
            variant="warning"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentSales />
          
          <div className="bg-card rounded-xl shadow-medium p-6 border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">Produtos em Baixo Estoque</h3>
            <div className="space-y-3">
              {["Produto A", "Produto B", "Produto C"].map((produto, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <span className="font-medium text-foreground">{produto}</span>
                  <span className="text-sm font-semibold text-warning">{5 - i} unidades</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
