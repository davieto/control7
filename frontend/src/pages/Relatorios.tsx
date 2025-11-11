import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, BarChart3 } from "lucide-react";

import RelatorioDialog from "@/components/forms/RelatorioDialog";
import  {RelatorioEstoqueDialog}  from "@/components/forms/RelatorioEstoqueDialog"; 
import { RelatorioFinanceiroDialog } from "@/components/forms/RelatorioFinanceiroDialog";
import { RelatorioClientesDialog } from "@/components/forms/RelatorioClientesDialog";


// ajuste o caminho conforme a pasta onde colocou

const Relatorios = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openEstoque, setOpenEstoque] = useState(false);
  const [openFinanceiro, setOpenFinanceiro] = useState(false);
  const [openClientes, setOpenClientes] = useState(false);


  const handleSave = (data: any) => {
    console.log("Dados enviados (vendas):", data);
  };

  const handleGenerateEstoque = (data: {
    produto?: string;
    fornecedor?: string;
    qtdMinima?: string;
  }) => {
    console.log("Filtros do Estoque:", data);

    // Aqui você chama API, gera PDF ou direciona para listagem
    // Exemplo:
    // fetch("/api/relatorios/estoque", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
  };

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

          {/* RELATÓRIO DE VENDAS */}
          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Relatório de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Análise completa de vendas por período, vendedor e produto.
              </p>
              <Button className="w-full" onClick={() => setOpenDialog(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* RELATÓRIO DE ESTOQUE */}
          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Relatório de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Produtos em estoque, movimentações e análise geral.
              </p>
              <Button className="w-full" variant="secondary" onClick={() => setOpenEstoque(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* FINANCEIRO */}
          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-success" />
                Relatório Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Receitas, despesas e análise completa de fluxo de caixa.
              </p>
              <Button className="w-full" variant="outline" onClick={() => setOpenFinanceiro(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* CLIENTES */}
          <Card className="shadow-medium hover:shadow-large transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-warning" />
                Relatório de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Histórico de compras e análise do perfil do cliente.
              </p>
              <Button className="w-full" variant="outline" onClick={() => setOpenClientes(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* DIALOG RELATÓRIO DE VENDAS */}
      <RelatorioDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSave={handleSave}
      />

      {/* DIALOG RELATÓRIO DE ESTOQUE */}
      <RelatorioEstoqueDialog 
        open={openEstoque}
        onOpenChange={setOpenEstoque}
        onGenerate={handleGenerateEstoque}
      />

      {/* DIALOG RELATÓRIO DE FINANCEIRO */}
      <RelatorioFinanceiroDialog
       open={openFinanceiro}
       onOpenChange={setOpenFinanceiro}
       onGenerate={(data) => console.log("Relatório financeiro ->", data)}
      />

      {/* DIALOG RELATÓRIO DE CLIENTES */}
      <RelatorioClientesDialog
      open={openClientes}
      onOpenChange={setOpenClientes}
      onGenerate={(data) => console.log("Relatório de clientes ->", data)}
/>
    </div>
  );
};

export default Relatorios;
