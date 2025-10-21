import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { validateCNPJ, formatCNPJ, formatPhone, formatCEP } from "@/lib/validators";

const fornecedorSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  cnpj: z.string().refine((val) => validateCNPJ(val), "CNPJ inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  contatoComercial: z.string().min(3, "Nome do contato inválido"),
  cep: z.string().min(8, "CEP inválido"),
  endereco: z.string().min(5, "Endereço inválido"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(3, "Bairro inválido"),
  cidade: z.string().min(3, "Cidade inválida"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),
});

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

interface FornecedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor?: any;
  onSave: (data: FornecedorFormData) => void;
}

export const FornecedorDialog = ({ open, onOpenChange, fornecedor, onSave }: FornecedorDialogProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: fornecedor || {},
  });

  const cnpj = watch("cnpj");
  const telefone = watch("telefone");
  const cep = watch("cep");

  const onSubmit = (data: FornecedorFormData) => {
    onSave(data);
    toast.success(fornecedor ? "Fornecedor atualizado com sucesso!" : "Fornecedor cadastrado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome">Nome/Razão Social *</Label>
              <Input id="nome" {...register("nome")} />
              {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
            </div>

            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input 
                id="cnpj" 
                {...register("cnpj")}
                value={cnpj ? formatCNPJ(cnpj) : ""}
                onChange={(e) => setValue("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && <p className="text-sm text-destructive">{errors.cnpj.message}</p>}
            </div>

            <div>
              <Label htmlFor="contatoComercial">Contato Comercial *</Label>
              <Input id="contatoComercial" {...register("contatoComercial")} />
              {errors.contatoComercial && <p className="text-sm text-destructive">{errors.contatoComercial.message}</p>}
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
              {fornecedor ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
