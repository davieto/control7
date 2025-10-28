import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Lock } from "lucide-react";

const Configuracoes = () => {
  // Estados para os campos do perfil
  const [nome, setNome] = useState("Admin");
  const [email, setEmail] = useState("admin@sistema.com");

  // Estados para as configurações do sistema
  const [empresa, setEmpresa] = useState("Minha Empresa LTDA");
  const [cnpj, setCnpj] = useState("00.000.000/0001-00");
  const [telefone, setTelefone] = useState("(11) 3456-7890");
  const [emailCorporativo, setEmailCorporativo] = useState("contato@empresa.com");

  // Estados para segurança (senha)
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Função para salvar perfil
  const handleSalvarPerfil = async () => {
    try {
      const response = await fetch("api/configuracoes/usuario/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email }),
      });
      if (response.ok) {
        alert("Alterações salvas com sucesso!");
      } else {
        alert("Erro ao salvar as alterações.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao se conectar ao servidor.");
    }
  };

  // Função para salvar as configurações do sistema
  const handleSalvarSistema = async () => {
    try {
      const response = await fetch("/configuracoes/sistema/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa, cnpj, telefone, emailCorporativo }),
      });
      if (response.ok) {
        alert("Configurações do sistema salvas!");
      } else {
        alert("Erro ao salvar configurações.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao se conectar ao servidor.");
    }
  };

  // Função para alterar senha
  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("/configuracoes/senha/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
        }),
      });
      if (response.ok) {
        alert("Senha alterada com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        alert("Erro ao alterar a senha.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao se conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Configuração</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Perfil */}
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
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input defaultValue="Administrador" disabled />
              </div>
              <Button className="w-full bg-gradient-primary" onClick={handleSalvarPerfil}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Segurança */}
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
                <Input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Senha</Label>
                <Input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              </div>
              <Button className="w-full" variant="outline" onClick={handleAlterarSenha}>
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Configurações do Sistema */}
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
                <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email Corporativo</Label>
                <Input type="email" value={emailCorporativo} onChange={(e) => setEmailCorporativo(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Button className="bg-gradient-primary" onClick={handleSalvarSistema}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;
