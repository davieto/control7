// import { useEffect, useState } from "react";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import { FuncionarioDialog } from "@/components/forms/FuncionarioDialog";
// import { Sidebar } from "@/components/layout/Sidebar";
// import { Header } from "@/components/layout/Header";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { apiFetch } from "@/lib/api";
// import { toast } from "sonner";

// const Funcionarios = () => {
//   const [funcionarios, setFuncionarios] = useState<any[]>([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<any>(null);

//   const carregar = async () => {
//     const data = await apiFetch("/funcionarios/");
//     setFuncionarios(data);
//   };

//   useEffect(() => { carregar(); }, []);

//   const handleSave = async (data: any) => {
//   try {
//     const payload = {
//       nome: data.nome,
//       cpf: data.cpf,
//       email: data.email,
//       telefone: data.telefone,
//       cargo: data.cargo,
//       nivel_acesso: data.nivelAcesso,
//       senha: data.senha || "123456", // requer senha no create
//     };

//     if (editing) {
//       // 🔧 PUT (edição)
//       await apiFetch(`/funcionarios/${editing.id}/`, {
//         method: "PUT",
//         body: JSON.stringify(payload),
//       });
//       toast.success("Funcionário atualizado!");
//     } else {
//       // ✏️ POST (novo)
//       await apiFetch("/funcionarios/", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });
//       toast.success("Funcionário cadastrado com sucesso!");
//     }

//     setDialogOpen(false);
//     setEditing(null);
//     setTimeout(() => window.location.reload(), 800);
//   } catch (error) {
//     console.error(error);
//     toast.error("Erro ao salvar funcionário");
//   }
// };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Deseja excluir este funcionário?")) return;
//     try {
//       await apiFetch(`/funcionarios/${id}/`, { method: "DELETE" });
//       toast.success("Funcionário excluído!");
//       setTimeout(() => window.location.reload(), 500);
//     } catch {
//       toast.error("Erro ao excluir funcionário");
//     }
//   };

//   // O JSX do return continua o mesmo...
//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
//       <Header />

//       <main className="ml-64 pt-16 p-8">
//         <div className="flex justify-between mb-8">
//           <h1 className="text-4xl font-bold">Funcionários</h1>
//           <Button onClick={() => setDialogOpen(true)}>
//             <Plus size={18} className="mr-2" /> Novo Funcionário
//           </Button>
//         </div>

//         <Card className="p-4">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Nome</TableHead>
//                 <TableHead>CPF</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Cargo</TableHead>
//                 <TableHead>Nível</TableHead>
//                 <TableHead className="text-right">Ações</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {funcionarios.map((f) => (
//                 <TableRow key={f.id}>
//                   <TableCell>{f.nome}</TableCell>
//                   <TableCell>{f.cpf}</TableCell>
//                   <TableCell>{f.email}</TableCell>
//                   <TableCell>{f.cargo}</TableCell>
//                   <TableCell>{f.nivel_acesso}</TableCell>
//                   <TableCell className="text-right">
//                     <Button variant="ghost" size="icon" onClick={() => { setEditing(f); setDialogOpen(true); }}>
//                       <Edit size={16} />
//                     </Button>
//                     <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}>
//                       <Trash2 size={16} className="text-destructive" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Card>
//       </main>

//       <FuncionarioDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         funcionario={editing}
//         onSave={handleSave}
//       />
//     </div>
//   );
// };

// export default Funcionarios;

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { FuncionarioDialog } from "@/components/forms/FuncionarioDialog";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  // Função que busca os dados atualizados
  const carregar = async () => {
    try {
      const data = await apiFetch("/funcionarios/");
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
      toast.error("Erro ao carregar funcionários.");
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleSave = async (data: any) => {
    try {
      // Prepara o objeto conforme o backend espera
      const payload = {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
        cargo: data.cargo,
        nivel_acesso: data.nivelAcesso, // Verifique se seu backend espera 'nivel_acesso'
        // Só envia senha se for criação ou se o usuário digitou uma nova
        senha: data.senha || (editing ? undefined : "123456"), 
      };

      if (editing) {
        // 🔧 PUT (edição)
        await apiFetch(`/funcionarios/${editing.id}/`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Funcionário atualizado!");
      } else {
        // ✏️ POST (novo)
        await apiFetch("/funcionarios/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Funcionário cadastrado com sucesso!");
      }

      setDialogOpen(false);
      setEditing(null);
      
      // ✨ MÁGICA: Atualiza a lista sem recarregar a página
      await carregar(); 

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar funcionário");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir este funcionário?")) return;
    try {
      await apiFetch(`/funcionarios/${id}/`, { method: "DELETE" });
      toast.success("Funcionário excluído!");
      
      // ✨ Atualiza a lista imediatamente
      await carregar(); 
    } catch {
      toast.error("Erro ao excluir funcionário");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="ml-64 pt-16 p-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold">Funcionários</h1>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus size={18} className="mr-2" /> Novo Funcionário
          </Button>
        </div>

        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionarios.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.nome}</TableCell>
                  <TableCell>{f.cpf}</TableCell>
                  <TableCell>{f.email}</TableCell>
                  <TableCell>{f.cargo}</TableCell>
                  <TableCell>{f.nivel_acesso}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(f); setDialogOpen(true); }}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}>
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      <FuncionarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        funcionario={editing}
        onSave={handleSave}
      />
    </div>
  );
};

export default Funcionarios;