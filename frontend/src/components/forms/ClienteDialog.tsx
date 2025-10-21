import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { validateCPF, formatCPF, formatPhone, formatCEP } from "@/lib/validators";

const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  rg: z.string().min(5, "RG inválido"),
  cpf: z.string().refine((val) => validateCPF(val), "CPF inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  celular: z.string().min(10, "Celular inválido"),
  cep: z.string().min(8, "CEP inválido"),
  endereco: z.string().min(5, "Endereço inválido"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(3, "Bairro inválido"),
  cidade: z.string().min(3, "Cidade inválida"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: any;
  onSave: (data: ClienteFormData) => void;
}

export const ClienteDialog = ({ open, onOpenChange, cliente, onSave }: ClienteDialogProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente || {},
  });

  const cpf = watch("cpf");
  const telefone = watch("telefone");
  const celular = watch("celular");
  const cep = watch("cep");

  const onSubmit = (data: ClienteFormData) => {
    onSave(data);
    toast.success(cliente ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" {...register("nome")} />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            </div>

            <div>
              <Label htmlFor="rg">RG *</Label>
              <Input id="rg" {...register("rg")} />
              {errors.rg && <p className="text-sm text-destructive">{errors.rg.message}</p>}
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
                placeholder="(00) 0000-0000"
              />
              {errors.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
            </div>

            <div>
              <Label htmlFor="celular">Celular *</Label>
              <Input 
                id="celular" 
                {...register("celular")}
                value={celular ? formatPhone(celular) : ""}
                onChange={(e) => setValue("celular", e.target.value)}
                placeholder="(00) 00000-0000"
              />
              {errors.celular && <p className="text-sm text-destructive">{errors.celular.message}</p>}
            </div>

            <div>
              <Label htmlFor="cep">CEP *</Label>
              <Input 
                id="cep" 
                {...register("cep")}
                value={cep ? formatCEP(cep) : ""}
                onChange={(e) => setValue("cep", e.target.value)}
                placeholder="00000-000"
              />
              {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input id="endereco" {...register("endereco")} />
              {errors.endereco && <p className="text-sm text-destructive">{errors.endereco.message}</p>}
            </div>

            <div>
              <Label htmlFor="numero">Número *</Label>
              <Input id="numero" {...register("numero")} />
              {errors.numero && <p className="text-sm text-destructive">{errors.numero.message}</p>}
            </div>

            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" {...register("complemento")} />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro *</Label>
              <Input id="bairro" {...register("bairro")} />
              {errors.bairro && <p className="text-sm text-destructive">{errors.bairro.message}</p>}
            </div>

            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input id="cidade" {...register("cidade")} />
              {errors.cidade && <p className="text-sm text-destructive">{errors.cidade.message}</p>}
            </div>

            <div>
              <Label htmlFor="uf">UF *</Label>
              <Input id="uf" {...register("uf")} maxLength={2} placeholder="SP" />
              {errors.uf && <p className="text-sm text-destructive">{errors.uf.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {cliente ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
