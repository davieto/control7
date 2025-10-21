import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, BarChart3 } from "lucide-react";

const Relatorios = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Relatórios</h1>
          <p className="text-muted-foreground">Análises e relatórios do seu negócio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Relatório de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Análise completa de vendas por período, vendedor e produto
              </p>
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Relatório de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Produtos em estoque, movimentações e alertas de reposição
              </p>
              <Button className="w-full" variant="secondary">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-success" />
                Relatório Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Receitas, despesas e análise de fluxo de caixa
              </p>
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                Relatório de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Base de clientes, histórico de compras e análise de perfil
              </p>
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Relatorios;
