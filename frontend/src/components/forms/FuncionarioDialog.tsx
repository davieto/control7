import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { validateCPF, formatCPF, formatPhone } from "@/lib/validators";

const funcionarioSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  cpf: z.string().refine((val) => validateCPF(val), "CPF inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cargo: z.string().min(3, "Cargo obrigatório"),
  nivelAcesso: z.enum(["admin", "vendedor", "gerente", "financeiro"]),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
});

type FuncionarioFormData = z.infer<typeof funcionarioSchema>;

interface FuncionarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionario?: any;
  onSave: (data: FuncionarioFormData) => void;
}

export const FuncionarioDialog = ({ open, onOpenChange, funcionario, onSave }: FuncionarioDialogProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FuncionarioFormData>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: funcionario || {},
  });

  const cpf = watch("cpf");
  const telefone = watch("telefone");
  const nivelAcesso = watch("nivelAcesso");

  const onSubmit = (data: FuncionarioFormData) => {
    onSave(data);
    toast.success(funcionario ? "Funcionário atualizado com sucesso!" : "Funcionário cadastrado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{funcionario ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" {...register("nome")} />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input 
                id="cpf" 
                {...register("cpf")}
                value={cpf ? formatCPF(cpf) : ""}
                onChange={(e) => setValue("cpf", e.target.value)}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input 
                id="telefone" 
                {...register("telefone")}
                value={telefone ? formatPhone(telefone) : ""}
                onChange={(e) => setValue("telefone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
            </div>

            <div>
              <Label htmlFor="cargo">Cargo *</Label>
              <Input id="cargo" {...register("cargo")} placeholder="Ex: Vendedor, Gerente..." />
              {errors.cargo && <p className="text-sm text-destructive">{errors.cargo.message}</p>}
            </div>

            <div>
              <Label htmlFor="nivelAcesso">Nível de Acesso *</Label>
              <Select value={nivelAcesso} onValueChange={(value: any) => setValue("nivelAcesso", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
              {errors.nivelAcesso && <p className="text-sm text-destructive">{errors.nivelAcesso.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="senha">{funcionario ? "Nova Senha (deixe em branco para manter)" : "Senha *"}</Label>
              <Input 
                id="senha" 
                type="password" 
                {...register("senha")} 
                placeholder="Mínimo 6 caracteres"
              />
              {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {funcionario ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
