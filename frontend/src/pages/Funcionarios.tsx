import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api"; // 1. Importe sua função apiFetch
import { toast } from "sonner";      // 2. Importe o toast

const Configuracoes = () => {
  // Estados para os campos do perfil - Inicialize vazios
  const [nome, setNome] = useState(""); 
  const [email, setEmail] = useState("");

  // Estados para as configurações do sistema - Inicialize vazios
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [emailCorporativo, setEmailCorporativo] = useState("");

  // Estados para segurança (senha)
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // 3. Função para carregar dados iniciais (similar ao 'carregar' dos Funcionarios)
  const carregarDados = async () => {
    try {
      // Assumindo que você tem GET endpoints para buscar os dados atuais
      const perfilData = await apiFetch("/configuracoes/usuario/"); 
      const sistemaData = await apiFetch("/configuracoes/sistema/"); 

      if (perfilData) {
        // ⚠️ Ajuste os nomes dos campos aqui para bater com o que a API retorna
        setNome(perfilData.first_name || perfilData.username || ""); // Use o campo correto do Django User
        setEmail(perfilData.email || "");
      }
      if (sistemaData) {
        // ⚠️ Ajuste os nomes dos campos aqui para bater com o que a API retorna
        setEmpresa(sistemaData.nome_empresa || "");
        setCnpj(sistemaData.cnpj || "");
        setTelefone(sistemaData.telefone || "");
        setEmailCorporativo(sistemaData.email_corporativo || "");
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Não foi possível carregar as configurações.");
    }
  };

  // 4. useEffect para carregar dados quando o componente montar
  useEffect(() => {
    carregarDados();
  }, []);

  // Função para salvar perfil (usando apiFetch e toast)
  const handleSalvarPerfil = async () => {
    try {
      // ⚠️ Use o nome de campo correto esperado pelo seu UsuarioSerializer (first_name, username?)
      const payload = { first_name: nome, email }; 
      
      await apiFetch("/configuracoes/usuario/", { // ⚠️ Garanta que a URL está correta (com /api/ se necessário)
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      toast.success("Perfil atualizado com sucesso!");
      // Geralmente não precisa recarregar a página aqui, mas pode chamar carregarDados() se quiser
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao salvar as alterações do perfil.");
    }
  };

  // Função para salvar as configurações do sistema (usando apiFetch e toast)
  const handleSalvarSistema = async () => {
    try {
      // Assumindo que os nomes dos campos batem com o ConfiguracaoSistemaSerializer
      const payload = { 
          nome_empresa: empresa, 
          cnpj, 
          telefone, 
          email_corporativo: emailCorporativo 
        };

      await apiFetch("/configuracoes/sistema/", { // ⚠️ Garanta que a URL está correta
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      toast.success("Configurações do sistema salvas!");
    } catch (error) {
      console.error("Erro ao salvar sistema:", error);
      toast.error("Erro ao salvar as configurações do sistema.");
    }
  };

  // Função para alterar senha (usando apiFetch e toast)
  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!"); // Use toast
      return;
    }

    try {
      // Use os nomes de campo esperados pelo AlterarSenhaSerializer
      const payload = {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
        confirmar_senha: confirmarSenha,
      };

      await apiFetch("/configuracoes/senha/", { // ⚠️ Garanta que a URL está correta
        method: "PATCH", // Certifique-se que o views.py também usa PATCH
        body: JSON.stringify(payload),
      });

      toast.success("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: any) { // Tipagem do erro para acessar response
      console.error("Erro ao alterar senha:", error);
      // Tenta extrair a mensagem de erro da API
      let errorMessage = "Erro desconhecido ao alterar a senha.";
      if (error.response && typeof error.response.data === 'object') {
         // Pega a primeira mensagem de erro dos campos do serializer
         const errors = error.response.data;
         const firstErrorKey = Object.keys(errors)[0];
         if (firstErrorKey && Array.isArray(errors[firstErrorKey])) {
           errorMessage = errors[firstErrorKey][0];
         } else if (errors.detail) {
           errorMessage = errors.detail;
         } else {
           errorMessage = JSON.stringify(errors);
         }
      } else if (error.message) {
         errorMessage = error.message;
      }
      toast.error(`Erro: ${errorMessage}`);
    }
  };

  // O JSX do return continua o mesmo...
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 p-8">
        {/* ... (Título e descrição) */}

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
               {/* Aplica a mesma classe do outro botão */}
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