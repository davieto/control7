import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, Search, Eye } from "lucide-react";
import { VendaDialog } from "@/components/forms/VendaDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Cliente = { id: number; nome: string };
type Produto = { id: number; descricao: string; preco: number; estoque: number };
type Funcionario = { id: number; nome?: string; user?: { first_name?: string } };
type ItemVenda = { id: number; produto: Produto; quantidade: number; preco_unitario: number; subtotal: number };
type Venda = {
  id: number;
  data_venda: string;
  cliente: Cliente;
  funcionario?: Funcionario;
  total: number;
  status: string;
  forma_pagamento: string;
  itens?: ItemVenda[];
};

const Vendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [vList, cList, pList, fList] = await Promise.all([
        apiFetch('/vendas/').catch(() => []),
        apiFetch('/clientes/').catch(() => []),
        apiFetch('/produtos/').catch(() => []),
        apiFetch('/funcionarios/').catch(() => []),
      ]);

      setVendas(vList || []);
      setClientes(cList || []);
      setProdutos(pList || []);
      setFuncionarios(fList || []);
    } catch (err) {
      console.error('Erro ao buscar dados de vendas:', err);
    }
  };

  const handleNew = () => setDialogOpen(true);

  const handleSave = async (data: any) => {
    // data: { cliente, observacoes, formaPagamento, itens, total }
    try {
      const funcionarioId = funcionarios?.[0]?.id || 1;
      const clienteId = parseInt(data.cliente, 10);
      if (isNaN(clienteId)) {
        console.error('Cliente inválido no payload:', data.cliente);
        try { (await import('sonner')).toast.error('Selecione um cliente válido antes de salvar.'); } catch {}
        return;
      }

      const payload = {
        cliente_id: clienteId,
        funcionario_id: funcionarioId,
        status: data.status || 'pendente',
        forma_pagamento: data.formaPagamento,
        observacoes: data.observacoes || '',
        itens: data.itens.map((i: any) => ({ produto_id: parseInt(i.produtoId, 10), quantidade: i.quantidade })),
      };

      console.log('Enviando payload venda:', payload);

      await apiFetch('/vendas/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // refresh
      await fetchData();
      setDialogOpen(false);
    } catch (err) {
      console.error('Erro no handleSave:', err);
      // apiFetch lança { response: { status, data } }
      if (err && err.response) {
        const status = err.response.status;
        const data = err.response.data;
        console.error('API error status:', status, 'data:', data);
        try { console.error('API error detail (stringified):', JSON.stringify(data, null, 2)); } catch {}
        const detail = data?.detail || (typeof data === 'string' ? data : (typeof data === 'object' ? JSON.stringify(data) : String(data)));
        // mostrar toast com detalhe
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.toast?.error?.(`Erro ao salvar venda: ${detail}`);
        // também exibir sonner
        try { (await import('sonner')).toast.error(`Erro ao salvar venda: ${detail}`); } catch {}
        return;
      }
      try { (await import('sonner')).toast.error('Erro ao salvar venda'); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Vendas</h1>
            <p className="text-muted-foreground">Gerencie suas vendas e pedidos</p>
          </div>
          <Button onClick={handleNew} className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large">
            <Plus className="w-4 h-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        <Card className="shadow-medium p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente ou vendedor..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID Venda</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map((venda) => (
                  <TableRow key={venda.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-medium">#{venda.id}</TableCell>
                    <TableCell>{new Date(venda.data_venda).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{venda.cliente?.nome}</TableCell>
                    <TableCell>{venda.funcionario?.nome || venda.funcionario?.user?.first_name || '-'}</TableCell>
                    <TableCell className="text-right font-semibold">R$ {Number(venda.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={venda.status === "pago" ? "default" : "secondary"}>
                        {venda.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>

      <VendaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clientes={clientes}
        produtos={produtos}
        onSave={handleSave}
      />
    </div>
  );

};

export default Vendas;
