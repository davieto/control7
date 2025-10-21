import { useState } from "react";
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

const mockClientes = [
  { id: 1, nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 98765-4321", cidade: "São Paulo", uf: "SP" },
  { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", telefone: "(11) 97654-3210", cidade: "Rio de Janeiro", uf: "RJ" },
  { id: 3, nome: "Pedro Costa", cpf: "456.789.123-00", email: "pedro@email.com", telefone: "(11) 96543-2109", cidade: "Belo Horizonte", uf: "MG" },
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);

  const handleEdit = (cliente: any) => {
    setEditingCliente(cliente);
    setDialogOpen(true);
  };

  const handleNew = () => {
    setEditingCliente(null);
    setDialogOpen(true);
  };

  const handleSave = (data: any) => {
    console.log("Salvando cliente:", data);
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
          <Button onClick={handleNew} className="bg-gradient-primary text-primary-foreground shadow-medium hover:shadow-large">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <Card className="shadow-medium p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
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
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{cliente.cidade}/{cliente.uf}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente)}>
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
