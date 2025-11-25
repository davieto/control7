import { useEffect, useState } from "react";
// Ajuste os caminhos conforme seu projeto
import { Sidebar } from "@/components/layout/Sidebar"; 
import { Header } from "@/components/layout/Header";   

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, User, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const Configuracoes = () => {
  // ========================================================================
  // ESTADOS
  // ========================================================================
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState(""); 

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [fornecedores, setFornecedores] = useState([]);
  const [editandoId, setEditandoId] = useState(null); 

  const [formFornecedor, setFormFornecedor] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
  });

  // ========================================================================
  // HELPERS
  // ========================================================================
  const formatarTelefone = (valor) => {
    if (!valor) return "";
    const apenasNumeros = valor.toString().replace(/\D/g, "");
    const truncado = apenasNumeros.slice(0, 11);
    return truncado
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const limparTelefone = (valor) => {
    if (!valor) return "";
    return valor.replace(/\D/g, "");
  };

  // ========================================================================
  // CARREGAMENTO
  // ========================================================================
  useEffect(() => {
    carregarUsuario();
    carregarFornecedores();
  }, []);

  const carregarUsuario = async () => {
    try {
      const data = await apiFetch("/configuracoes/usuario/");
      if (data) {
        setNome(data.first_name || data.username || "");
        setEmail(data.email || "");
        setCargo(data.cargo || "Não informado"); 
      }
    } catch (error) {
      console.error("Erro usuario:", error);
    }
  };

  const carregarFornecedores = async () => {
    try {
      const data = await apiFetch("/configuracoes/fornecedores/");
      const lista = Array.isArray(data) ? data : [];
      setFornecedores(lista);

      // Seleciona automaticamente a primeira empresa da lista para edição
      if (lista.length > 0) {
        selecionarEmpresa(lista[0].id.toString(), lista);
      }
    } catch (error) {
      console.error("Erro lista:", error);
    }
  };

  // ========================================================================
  // LÓGICA DE SELEÇÃO
  // ========================================================================
  const selecionarEmpresa = (valorSelecionado, lista = fornecedores) => {
    // Removemos a lógica de "nova", agora só busca ID existente
    const empresaEncontrada = lista.find((f) => f.id.toString() === valorSelecionado);
    
    if (empresaEncontrada) {
      setEditandoId(empresaEncontrada.id);
      setFormFornecedor({
        nome: empresaEncontrada.nome || "",
        cnpj: empresaEncontrada.cnpj || "",
        telefone: formatarTelefone(empresaEncontrada.telefone || ""),
        email: empresaEncontrada.email || "",
      });
    }
  };

  // ========================================================================
  // AÇÕES DE SALVAR
  // ========================================================================
  const handleSalvarPerfil = async () => {
    try {
      await apiFetch("/configuracoes/usuario/", {
        method: "PUT",
        body: JSON.stringify({ first_name: nome, email: email }),
      });
      toast.success("Perfil atualizado! Recarregando...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error("Erro ao salvar perfil.");
    }
  };

  const handleAlterarSenha = async () => {
    if (novaSenha.length < 6) {
      return toast.warning("A nova senha deve ter no mínimo 6 caracteres.");
    }
    if (novaSenha !== confirmarSenha) return toast.error("Senhas não conferem");
    
    try {
      await apiFetch("/configuracoes/senha/", {
        method: "PUT",
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha, confirmar_senha: confirmarSenha }),
      });
      toast.success("Senha alterada! Recarregando...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error("Erro ao alterar senha.");
    }
  };

  const handleSalvarFornecedor = async () => {
    // Trava de segurança: Se não tiver editando ninguém, não faz nada
    if (!editandoId) {
      return toast.error("Selecione uma empresa para editar.");
    }

    try {
      const payload = {
        ...formFornecedor,
        telefone: limparTelefone(formFornecedor.telefone)
      };

      // AQUI MUDOU: Só existe PUT (Edição), removemos o POST (Criação)
      await apiFetch(`/configuracoes/fornecedores/${editandoId}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      
      toast.success("Dados da empresa atualizados! Recarregando...");
      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar empresa.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Se você usa Layout global, pode remover Sidebar/Header daqui */}
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Configuração</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e dados da empresa</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* --- PERFIL --- */}
          <Card className="shadow-medium">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5"/> Perfil</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input value={nome} onChange={e=>setNome(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input value={cargo} disabled className="bg-muted text-muted-foreground opacity-100" />
                </div>
                <Button className="w-full bg-gradient-primary" onClick={handleSalvarPerfil}>Salvar Perfil</Button>
             </CardContent>
          </Card>

          {/* --- SEGURANÇA --- */}
          <Card className="shadow-medium">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5"/> Segurança</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Senha Atual</Label>
                    <Input type="password" value={senhaAtual} onChange={e=>setSenhaAtual(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <Label>Nova Senha (mín. 6)</Label>
                    <Input type="password" value={novaSenha} onChange={e=>setNovaSenha(e.target.value)}/>
                </div>
                <div className="space-y-2">
                    <Label>Confirmar</Label>
                    <Input type="password" value={confirmarSenha} onChange={e=>setConfirmarSenha(e.target.value)}/>
                </div>
                <Button className="w-full bg-gradient-primary" onClick={handleAlterarSenha}>Alterar Senha</Button>
             </CardContent>
          </Card>

          {/* --- SISTEMA (AGORA SÓ EDIÇÃO) --- */}
          <Card className="shadow-medium lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" /> Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 space-y-2">
                <Label className="text-primary font-semibold">Selecionar Empresa</Label>
                <Select 
                    onValueChange={(val) => selecionarEmpresa(val)} 
                    value={editandoId ? editandoId.toString() : ""}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione a empresa..." /></SelectTrigger>
                  <SelectContent>
                    {/* REMOVI A OPÇÃO "+ CADASTRAR NOVA EMPRESA" DAQUI */}
                    {fornecedores.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>{emp.nome} {emp.cnpj ? `- ${emp.cnpj}` : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input value={formFornecedor.nome} onChange={(e) => setFormFornecedor({...formFornecedor, nome: e.target.value})} placeholder="Nome fantasia"/>
              </div>
              
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input value={formFornecedor.cnpj} onChange={(e) => setFormFornecedor({...formFornecedor, cnpj: e.target.value})} placeholder="00.000.000/0000-00"/>
              </div>
              
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={formFornecedor.telefone} maxLength={15} placeholder="(00) 00000-0000" onChange={(e) => setFormFornecedor({...formFornecedor, telefone: formatarTelefone(e.target.value)})}/>
              </div>
              
              <div className="space-y-2">
                <Label>Email Corporativo</Label>
                <Input value={formFornecedor.email} onChange={(e) => setFormFornecedor({...formFornecedor, email: e.target.value})}/>
              </div>

              <div className="md:col-span-2 pt-4">
                <Button className="bg-gradient-primary w-full md:w-auto" onClick={handleSalvarFornecedor}>
                   Salvar Alterações
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