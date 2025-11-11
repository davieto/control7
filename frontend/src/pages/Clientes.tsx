import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { ClienteDialog } from "@/components/forms/ClienteDialog";
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
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const Clientes = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/clientes/");
      setClientes(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSave = async (data: any) => {
    try {
      // *** Atenção: 'data' deve ter os campos esperados pelo backend,
      // ex: { nome, cnpj, contato_comercial, email, telefone, cidade, uf, ... }
      if (editingCliente) {
        await apiFetch(`/clientes/${editingCliente.id}/`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        toast.success("Cliente atualizado!");
      } else {
        await apiFetch("/clientes/", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Cliente criado!");
      }

      setDialogOpen(false);
      setEditingCliente(null);
      carregarClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente");
    }
  };

  const handleEdit = (cliente: any) => {
    setEditingCliente(cliente);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingCliente(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await apiFetch(`/clientes/${id}/`, { method: "DELETE" });
      toast.success("Cliente excluído com sucesso!");
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua base de clientes</p>
          </div>
          <Button
            onClick={handleNew}
            className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <Card className="shadow-medium p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {!loading ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes
                    .filter((c) => {
                      const term = searchTerm.toLowerCase();
                      return (
                        c.nome?.toLowerCase().includes(term) ||
                        (c.email || "").toLowerCase().includes(term) ||
                        (c.cnpj || "").includes(term)
                      );
                    })
                    .map((cliente) => (
                      <TableRow key={cliente.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell className="font-mono">{cliente.cnpj}</TableCell>
                        <TableCell>{cliente.contato_comercial}</TableCell>
                        <TableCell>{cliente.email}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(cliente)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(cliente.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Carregando clientes...</p>
          )}
        </Card>
      </main>

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={editingCliente}
        onSave={handleSave}
      />
    </div>
  );
};

export default Clientes;
