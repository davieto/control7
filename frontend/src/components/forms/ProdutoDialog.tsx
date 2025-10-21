import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const produtoSchema = z.object({
  descricao: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres").max(200),
  codigo: z.string().min(1, "Código obrigatório"),
  preco: z.string().refine((val) => parseFloat(val) > 0, "Preço deve ser maior que zero"),
  estoque: z.string().refine((val) => parseInt(val) >= 0, "Estoque não pode ser negativo"),
  estoqueMinimo: z.string().refine((val) => parseInt(val) >= 0, "Estoque mínimo não pode ser negativo"),
  fornecedor: z.string().min(1, "Fornecedor obrigatório"),
  unidadeMedida: z.string().min(1, "Unidade de medida obrigatória"),
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

interface ProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto?: any;
  fornecedores: Array<{ id: number; nome: string }>;
  onSave: (data: ProdutoFormData) => void;
}

export const ProdutoDialog = ({ open, onOpenChange, produto, fornecedores, onSave }: ProdutoDialogProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: produto || { estoqueMinimo: "10" },
  });

  const unidadeMedida = watch("unidadeMedida");
  const fornecedor = watch("fornecedor");

  const onSubmit = (data: ProdutoFormData) => {
    onSave(data);
    toast.success(produto ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{produto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input id="descricao" {...register("descricao")} />
              {errors.descricao && <p className="text-sm text-destructive">{errors.descricao.message}</p>}
            </div>

            <div>
              <Label htmlFor="codigo">Código Interno *</Label>
              <Input id="codigo" {...register("codigo")} />
              {errors.codigo && <p className="text-sm text-destructive">{errors.codigo.message}</p>}
            </div>

            <div>
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input 
                id="preco" 
                type="number" 
                step="0.01" 
                {...register("preco")} 
                placeholder="0.00"
              />
              {errors.preco && <p className="text-sm text-destructive">{errors.preco.message}</p>}
            </div>

            <div>
              <Label htmlFor="estoque">Estoque Atual *</Label>
              <Input 
                id="estoque" 
                type="number" 
                {...register("estoque")} 
                placeholder="0"
              />
              {errors.estoque && <p className="text-sm text-destructive">{errors.estoque.message}</p>}
            </div>

            <div>
              <Label htmlFor="estoqueMinimo">Estoque Mínimo *</Label>
              <Input 
                id="estoqueMinimo" 
                type="number" 
                {...register("estoqueMinimo")} 
                placeholder="10"
              />
              {errors.estoqueMinimo && <p className="text-sm text-destructive">{errors.estoqueMinimo.message}</p>}
            </div>

            <div>
              <Label htmlFor="unidadeMedida">Unidade de Medida *</Label>
              <Select value={unidadeMedida} onValueChange={(value) => setValue("unidadeMedida", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UN">Unidade</SelectItem>
                  <SelectItem value="CX">Caixa</SelectItem>
                  <SelectItem value="PC">Peça</SelectItem>
                  <SelectItem value="KG">Quilograma</SelectItem>
                  <SelectItem value="MT">Metro</SelectItem>
                  <SelectItem value="LT">Litro</SelectItem>
                </SelectContent>
              </Select>
              {errors.unidadeMedida && <p className="text-sm text-destructive">{errors.unidadeMedida.message}</p>}
            </div>

            <div>
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Select value={fornecedor} onValueChange={(value) => setValue("fornecedor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor..." />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fornecedor && <p className="text-sm text-destructive">{errors.fornecedor.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {produto ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
