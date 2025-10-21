import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { ProdutoDialog } from "@/components/forms/ProdutoDialog";
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

const mockProdutos = [
  { id: 1, descricao: "Notebook Dell", codigo: "NB001", preco: 3500.00, estoque: 15, fornecedor: "Tech Supply" },
  { id: 2, descricao: "Mouse Logitech", codigo: "MS001", preco: 89.90, estoque: 45, fornecedor: "Periféricos LTDA" },
  { id: 3, descricao: "Teclado Mecânico", codigo: "TC001", preco: 450.00, estoque: 8, fornecedor: "Periféricos LTDA" },
  { id: 4, descricao: "Monitor LG 24\"", codigo: "MN001", preco: 890.00, estoque: 3, fornecedor: "Tech Supply" },
];

const mockFornecedores = [
  { id: 1, nome: "Tech Supply" },
  { id: 2, nome: "Periféricos LTDA" },
];

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<any>(null);

  const handleEdit = (produto: any) => {
    setEditingProduto(produto);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingProduto(null);
    setDialogOpen(true);
  };

  const handleSave = (data: any) => {
    console.log("Salvando produto:", data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Produtos</h1>
            <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
          </div>
          <Button onClick={handleNew} className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        <Card className="shadow-medium p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou código..."
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
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-center">Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProdutos.map((produto) => (
                  <TableRow key={produto.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-medium">{produto.codigo}</TableCell>
                    <TableCell className="font-medium">{produto.descricao}</TableCell>
                    <TableCell>{produto.fornecedor}</TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {produto.preco.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={produto.estoque < 10 ? "destructive" : "default"}
                        className="gap-1"
                      >
                        <Package className="w-3 h-3" />
                        {produto.estoque}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(produto)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
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

      <ProdutoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        produto={editingProduto}
        fornecedores={mockFornecedores}
        onSave={handleSave}
      />
    </div>
  );
};

export default Produtos;
