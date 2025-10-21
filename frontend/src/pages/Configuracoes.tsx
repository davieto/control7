import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Lock, Bell } from "lucide-react";

const Configuracoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input defaultValue="Admin" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="admin@sistema.com" />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input defaultValue="Administrador" disabled />
              </div>
              <Button className="w-full bg-gradient-primary">Salvar Alterações</Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Senha</Label>
                <Input type="password" />
              </div>
              <Button className="w-full" variant="outline">Alterar Senha</Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input defaultValue="Minha Empresa LTDA" />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input defaultValue="00.000.000/0001-00" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input defaultValue="(11) 3456-7890" />
              </div>
              <div className="space-y-2">
                <Label>Email Corporativo</Label>
                <Input type="email" defaultValue="contato@empresa.com" />
              </div>
              <div className="md:col-span-2">
                <Button className="bg-gradient-primary">Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;
