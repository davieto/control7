import { useEffect, useState } from "react"; // Importe o useEffect
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api"; // 1. Importe sua função de API
import { toast } from "sonner"; // 2. Importe o toast

const Configuracoes = () => {
  // Estados para os campos (começam vazios, serão preenchidos pela API)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // 3. Função para carregar os dados do banco
  const carregarDados = async () => {
    try {
      // (Seu backend precisa ter um método GET para estas rotas)
      const perfilData = await apiFetch("/configuracoes/usuario/");
      const sistemaData = await apiFetch("/configuracoes/sistema/");

      if (perfilData) {
        //  Ajuste os campos aqui para bater com o seu Serializer do Django
        // O User model do Django usa 'first_name' ou 'username'
        setNome(perfilData.first_name || perfilData.username || "");
        setEmail(perfilData.email || "");
      }
      if (sistemaData) {
        setEmpresa(sistemaData.nome_empresa || "");
        setCnpj(sistemaData.cnpj || "");
        setTelefone(sistemaData.telefone || "");
        setEmailCorporativo(sistemaData.email_corporativo || "");
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Não foi possível carregar os dados das configurações.");
    }
  };

  // 4. Roda a função 'carregarDados' quando o componente é montado
  useEffect(() => {
    carregarDados();
  }, []);

  // --- Funções de Salvamento Refatoradas ---

  const handleSalvarPerfil = async () => {
    try {
      //  Use os campos que o seu UsuarioSerializer espera!
      const payload = {
        first_name: nome, // Mapeia 'nome' do frontend para 'first_name' do Django
        email: email,
      };

      await apiFetch("/configuracoes/usuario/", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      const errorMessage = error.response?.data?.detail || "Erro ao salvar o perfil.";
      toast.error(errorMessage);
    }
  };

  const handleSalvarSistema = async () => {
    try {
      // Mapeia os estados do frontend para os campos do Serializer do Django
      const payload = {
        nome_empresa: empresa,
        cnpj: cnpj,
        telefone: telefone,
        email_corporativo: emailCorporativo,
      };

      await apiFetch("/configuracoes/sistema/", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Configurações do sistema salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar sistema:", error);
      const errorMessage = error.response?.data?.detail || "Erro ao salvar as configurações.";
      toast.error(errorMessage);
    }
  };

  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      // Mapeia os estados do frontend para os campos do Serializer do Django
      const payload = {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
        confirmar_senha: confirmarSenha,
      };

      await apiFetch("/configuracoes/senha/", {
        method: "PUT", // (Seu views.py espera PATCH)
        body: JSON.stringify(payload),
      });

      toast.success("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      let errorMessage = "Erro desconhecido ao alterar a senha.";
      
      // Tenta extrair a mensagem de erro específica do Django (400 Bad Request)
      if (error.response && error.response.data) {
        const errors = error.response.data;
        // Pega o primeiro erro de validação (ex: "senha_atual": ["Senha incorreta."])
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey && Array.isArray(errors[firstErrorKey])) {
          errorMessage = errors[firstErrorKey][0];
        } else if (errors.detail) { // Erro genérico (ex: 401, 403)
          errorMessage = errors.detail;
        } else {
          errorMessage = JSON.stringify(errors);
        }
      }
      toast.error(`Erro: ${errorMessage}`);
    }
  };

  // O JSX (layout) permanece o mesmo, apenas os botões agora usam a mesma classe
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
              <Button className="w-full bg-gradient-primary" onClick={handleAlterarSenha}>
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