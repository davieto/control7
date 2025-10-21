import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { FornecedorDialog } from "@/components/forms/FornecedorDialog";
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
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Função para carregar lista do backend
  const carregarFornecedores = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/fornecedores/");
      setFornecedores(data);
    } catch (e) {
      toast.error("Erro ao carregar fornecedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  // ✅ SALVAR (criar ou editar)
  const handleSave = async (data: any) => {
    try {
      if (editingFornecedor) {
        // Edição (PUT)
        await apiFetch(`/fornecedores/${editingFornecedor.id}/`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        toast.success("Fornecedor atualizado!");
      } else {
        // Criação (POST)
        await apiFetch("/fornecedores/", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Fornecedor criado!");
      }

      setDialogOpen(false);
      setEditingFornecedor(null);
      carregarFornecedores();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar fornecedor");
    }
  };

  // ✅ ABRIR MODAL DE EDIÇÃO
  const handleEdit = (fornecedor: any) => {
    setEditingFornecedor(fornecedor);
    setDialogOpen(true);
  };

  // ✅ NOVO
  const handleNew = () => {
    setEditingFornecedor(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
  if (!confirm("Deseja realmente excluir este fornecedor?")) return;

  try {
    await apiFetch(`/fornecedores/${id}/`, { method: "DELETE" });
    toast.success("Fornecedor excluído!");
    
    // Aguarda o refresh da lista do backend
    await carregarFornecedores();

  } catch (error) {
    console.error(error);
    toast.error("Erro ao excluir fornecedor");
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Fornecedores</h1>
            <p className="text-muted-foreground">Gerencie seus fornecedores</p>
          </div>
          <Button
            onClick={handleNew}
            className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>

        <Card className="shadow-medium p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ ou contato..."
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
                    <TableHead>Contato Comercial</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fornecedores
                    .filter((f) =>
                      f.nome.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((fornecedor) => (
                      <TableRow
                        key={fornecedor.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                        <TableCell className="font-mono">{fornecedor.cnpj}</TableCell>
                        <TableCell>{fornecedor.contato_comercial}</TableCell>
                        <TableCell>{fornecedor.email}</TableCell>
                        <TableCell>{fornecedor.telefone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(fornecedor)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(fornecedor.id)}
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
            <p>Carregando fornecedores...</p>
          )}
        </Card>
      </main>

      {/* Modal de criar/editar fornecedor */}
      <FornecedorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fornecedor={editingFornecedor}
        onSave={handleSave}
      />
    </div>
  );
};

export default Fornecedores;