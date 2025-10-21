import { useState } from "react";
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

const mockVendas = [
  { id: "#12345", data: "2025-10-20", cliente: "João Silva", total: 1234.56, status: "Pago", vendedor: "Admin" },
  { id: "#12344", data: "2025-10-20", cliente: "Maria Santos", total: 856.90, status: "Pendente", vendedor: "Admin" },
  { id: "#12343", data: "2025-10-19", cliente: "Pedro Costa", total: 2450.00, status: "Pago", vendedor: "Admin" },
  { id: "#12342", data: "2025-10-19", cliente: "Ana Oliveira", total: 678.30, status: "Pago", vendedor: "Admin" },
];

const mockClientes = [
  { id: 1, nome: "João Silva" },
  { id: 2, nome: "Maria Santos" },
  { id: 3, nome: "Pedro Costa" },
];

const mockProdutos = [
  { id: 1, descricao: "Notebook Dell", preco: 3500.00, estoque: 15 },
  { id: 2, descricao: "Mouse Logitech", preco: 89.90, estoque: 45 },
  { id: 3, descricao: "Teclado Mecânico", preco: 450.00, estoque: 8 },
];

const Vendas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNew = () => {
    setDialogOpen(true);
  };

  const handleSave = (data: any) => {
    console.log("Salvando venda:", data);
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
                {mockVendas.map((venda) => (
                  <TableRow key={venda.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-medium">{venda.id}</TableCell>
                    <TableCell>{new Date(venda.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{venda.cliente}</TableCell>
                    <TableCell>{venda.vendedor}</TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {venda.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={venda.status === "Pago" ? "default" : "secondary"}>
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
        clientes={mockClientes}
        produtos={mockProdutos}
        onSave={handleSave}
      />
    </div>
  );
};

export default Vendas;
