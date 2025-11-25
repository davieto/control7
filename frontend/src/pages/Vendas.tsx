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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);
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

      // load current user info (may contain mapping to funcionario)
      const userInfo = await apiFetch('/configuracoes/usuario/').catch(() => null);
      setCurrentUser(userInfo);

      setVendas(vList || []);
      setClientes(cList || []);
      setProdutos(pList || []);
      setFuncionarios(fList || []);
      if (userInfo) {
        // try to set funcionario name from userInfo if available
        // userInfo may include funcionario id or first_name
      }
    } catch (err) {
      console.error('Erro ao buscar dados de vendas:', err);
    }
  };

  const capitalize = (s: string | undefined | null) => {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const handleNew = () => setDialogOpen(true);

  const handleSave = async (data: any) => {
    // data: { cliente, observacoes, formaPagamento, itens, total }
    try {
      // Prefer funcionario id from current user if available
      const funcionarioId = (currentUser && (currentUser.funcionario || currentUser.funcionario_id)) || funcionarios?.[0]?.id || 1;
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

  const handleTogglePayment = async (vendaId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'pago' ? 'pendente' : 'pago';
    try {
      await apiFetch(`/vendas/${vendaId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (newStatus === 'pago') {
        (await import('sonner')).toast.success('Pagamento confirmado.');
      } else {
        (await import('sonner')).toast.success('Pagamento cancelado.');
      }
      await fetchData();
    } catch (err) {
      console.error('Erro ao atualizar pagamento:', err);
      try { (await import('sonner')).toast.error('Erro ao atualizar pagamento'); } catch {}
    }
  };

  const openDetails = async (vendaId: number) => {
    try {
      const data = await apiFetch(`/vendas/${vendaId}/`);
      setSelectedVenda(data);
      setDetailOpen(true);
    } catch (err) {
      console.error('Erro ao buscar detalhes da venda:', err);
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
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(
                  // client-side filtering: ID, cliente nome, vendedor nome
                  vendas || []
                ).filter((venda) => {
                  if (!searchTerm || !searchTerm.trim()) return true;
                  const q = searchTerm.trim().toLowerCase();
                  // match by id
                  if (String(venda.id).includes(q)) return true;
                  // match by date (pt-BR)
                  try {
                    const dateStr = new Date(venda.data_venda).toLocaleDateString('pt-BR');
                    if (dateStr.toLowerCase().includes(q)) return true;
                  } catch (e) {
                    // ignore invalid dates
                  }
                  // cliente name
                  if (venda.cliente && venda.cliente.nome && venda.cliente.nome.toLowerCase().includes(q)) return true;
                  // funcionario name (may be nested)
                  const fName = venda.funcionario?.nome || venda.funcionario?.user?.first_name || '';
                  if (fName && fName.toLowerCase().includes(q)) return true;
                  // status
                  if (venda.status && venda.status.toLowerCase().includes(q)) return true;
                  return false;
                }).map((venda) => (
                  <TableRow key={venda.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-medium">#{venda.id}</TableCell>
                    <TableCell>{new Date(venda.data_venda).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{venda.cliente?.nome}</TableCell>
                    <TableCell>{venda.funcionario?.nome || venda.funcionario?.user?.first_name || '-'}</TableCell>
                    <TableCell className="text-right font-semibold">R$ {Number(venda.total).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={venda.status === "pago" ? "default" : "secondary"}>
                        {capitalize(venda.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleTogglePayment(venda.id, venda.status)}
                          className={venda.status === 'pago' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}
                          size="sm"
                        >
                          {venda.status === 'pago' ? 'Cancelar Pagamento' : 'Confirmar Pagamento'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDetails(venda.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
      {/* Details modal */}
      {detailOpen && selectedVenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">Detalhes da Venda #{selectedVenda.id}</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setDetailOpen(false)}>Fechar</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p>{new Date(selectedVenda.data_venda).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p>{selectedVenda.cliente?.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendedor</p>
                <p>{selectedVenda.funcionario?.nome || selectedVenda.funcionario?.user?.first_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                <p>{selectedVenda.forma_pagamento}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Itens</h3>
              <div className="overflow-auto max-h-48">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Produto</th>
                      <th className="text-center">Quantidade</th>
                      <th className="text-right">Preço Unit.</th>
                      <th className="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVenda.itens?.map((it: any) => (
                      <tr key={it.id}>
                        <td className="text-left">{it.produto?.descricao || it.produto?.descricao}</td>
                        <td className="text-center">{it.quantidade}</td>
                        <td className="text-right">R$ {Number(it.preco_unitario).toFixed(2)}</td>
                        <td className="text-right">R$ {Number(it.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-bold">R$ {Number(selectedVenda.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
