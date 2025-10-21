import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
import { FuncionarioDialog } from "@/components/forms/FuncionarioDialog";

const mockFuncionarios = [
  { id: 1, nome: "Carlos Alberto", cpf: "123.456.789-00", email: "carlos@empresa.com", telefone: "(11) 98765-4321", cargo: "Vendedor", nivelAcesso: "vendedor" },
  { id: 2, nome: "Ana Paula", cpf: "987.654.321-00", email: "ana@empresa.com", telefone: "(11) 97654-3210", cargo: "Gerente de Vendas", nivelAcesso: "gerente" },
  { id: 3, nome: "Roberto Silva", cpf: "456.789.123-00", email: "roberto@empresa.com", telefone: "(11) 96543-2109", cargo: "Administrador", nivelAcesso: "admin" },
];

const nivelAcessoLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  admin: { label: "Administrador", variant: "destructive" },
  gerente: { label: "Gerente", variant: "default" },
  vendedor: { label: "Vendedor", variant: "secondary" },
  financeiro: { label: "Financeiro", variant: "outline" },
};

const Funcionarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<any>(null);

  const handleEdit = (funcionario: any) => {
    setEditingFuncionario(funcionario);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingFuncionario(null);
    setDialogOpen(true);
  };

  const handleSave = (data: any) => {
    console.log("Salvando funcionário:", data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Funcionários</h1>
            <p className="text-muted-foreground">Gerencie sua equipe e níveis de acesso</p>
          </div>
          <Button onClick={handleNew} className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large">
            <Plus className="w-4 h-4 mr-2" />
            Novo Funcionário
          </Button>
        </div>

        <Card className="shadow-medium p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou cargo..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Nível de Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFuncionarios.map((funcionario) => (
                  <TableRow key={funcionario.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{funcionario.nome}</TableCell>
                    <TableCell className="font-mono">{funcionario.cpf}</TableCell>
                    <TableCell>{funcionario.email}</TableCell>
                    <TableCell>{funcionario.telefone}</TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell>
                      <Badge variant={nivelAcessoLabels[funcionario.nivelAcesso].variant}>
                        {nivelAcessoLabels[funcionario.nivelAcesso].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(funcionario)}>
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

      <FuncionarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        funcionario={editingFuncionario}
        onSave={handleSave}
      />
    </div>
  );
};

export default Funcionarios;
