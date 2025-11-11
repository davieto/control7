import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const estoqueSchema = z.object({
  produto: z.string().optional(),
  fornecedor: z.string().optional(),
  qtdMinima: z.string().optional(),
});

type EstoqueFormData = z.infer<typeof estoqueSchema>;

interface RelatorioEstoqueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: EstoqueFormData) => void;
}

export const RelatorioEstoqueDialog = ({ open, onOpenChange, onGenerate }: RelatorioEstoqueDialogProps) => {
  const { register, handleSubmit } = useForm<EstoqueFormData>({
    resolver: zodResolver(estoqueSchema),
  });

  const onSubmit = (data: EstoqueFormData) => {
    onGenerate(data);
    toast.success("Relatório gerado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Relatório de Estoque</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <Label>Produto</Label>
            <Input placeholder="Nome do produto" {...register("produto")} />
          </div>

          <div>
            <Label>Fornecedor</Label>
            <Input placeholder="Nome do fornecedor" {...register("fornecedor")} />
          </div>

          <div>
            <Label>Quantidade mínima</Label>
            <Input type="number" placeholder="Ex: 10" {...register("qtdMinima")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Gerar Relatório
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
