import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ProdutoDialog } from "@/components/forms/ProdutoDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const Produtos = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  // carregar dados
  const loadAll = async () => {
    const [prodList, fornList] = await Promise.all([
      apiFetch("/produtos/"),
      apiFetch("/fornecedores/"),
    ]);
    setProdutos(prodList);
    setFornecedores(fornList);
  };

  useEffect(() => { loadAll(); }, []);

  // salvar
  const handleSave = async (data: any) => {
  try {
    const body = {
      descricao: data.descricao,
      codigo: data.codigo,
      preco: parseFloat(data.preco),
      estoque: parseInt(data.estoque),
      estoque_minimo: parseInt(data.estoqueMinimo || 0),
      unidade_medida: data.unidadeMedida,
      fornecedor: parseInt(data.fornecedor),
    };

    if (editing) {
      await apiFetch(`/produtos/${editing.id}/`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      toast.success("Produto atualizado!");
    } else {
      await apiFetch("/produtos/", {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast.success("Produto criado!");
    }

    setDialogOpen(false);
    setEditing(null);

    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error("Erro ao salvar produto:", err);
    toast.error("Erro ao salvar produto");
  }
};
  // excluir
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir este produto?")) return;
    try {
      await apiFetch(`/produtos/${id}/`, { method: "DELETE" });
      toast.success("Produto excluído!");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-4xl font-bold">Produtos</h1>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2" size={18} /> Novo Produto
          </Button>
        </div>
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.codigo}</TableCell>
                  <TableCell>{p.descricao}</TableCell>
                  <TableCell>{p.fornecedor_nome}</TableCell>
                  <TableCell>R$ {Number(p.preco).toFixed(2)}</TableCell>
                  <TableCell>{p.estoque}</TableCell>
                  <TableCell>{p.unidade_medida}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
      <ProdutoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        produto={editing}
        fornecedores={fornecedores}
        onSave={handleSave}
      />
    </div>
  );
};

export default Produtos;