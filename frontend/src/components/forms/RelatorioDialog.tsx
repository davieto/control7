import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const relatorioSchema = z.object({
  dataInicio: z.string().min(1, "Informe a data inicial"),
  dataFim: z.string().min(1, "Informe a data final"),
  vendedor: z.string().optional(),
  produto: z.string().optional(),
});

type RelatorioFormData = z.infer<typeof relatorioSchema>;

interface RelatorioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: RelatorioFormData) => void;
}

export default function RelatorioDialog({ open, onOpenChange, onSave }: RelatorioDialogProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RelatorioFormData>({
    resolver: zodResolver(relatorioSchema),
  });

  const onSubmit = (data: RelatorioFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Relatório de Vendas</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <Label>Data Inicial *</Label>
            <Input type="date" {...register("dataInicio")} />
            {errors.dataInicio && <p className="text-sm text-destructive">{errors.dataInicio.message}</p>}
          </div>

          <div>
            <Label>Data Final *</Label>
            <Input type="date" {...register("dataFim")} />
            {errors.dataFim && <p className="text-sm text-destructive">{errors.dataFim.message}</p>}
          </div>

          <div>
            <Label>Vendedor (opcional)</Label>
            <Input placeholder="Ex: João Silva" {...register("vendedor")} />
          </div>

          <div>
            <Label>Produto (opcional)</Label>
            <Input placeholder="Ex: Caneta Azul" {...register("produto")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Gerar Relatório
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
