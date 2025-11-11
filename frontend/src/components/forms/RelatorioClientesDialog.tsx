import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";

interface RelatorioClientesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: any) => void;
}

export function RelatorioClientesDialog({ open, onOpenChange, onGenerate }: RelatorioClientesDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const handleGenerate = (data: any) => {
    onGenerate(data);
    reset();
    onOpenChange(false);
  };

  const historicoCompras = watch("historicoCompras");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Clientes</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleGenerate)} className="space-y-4">

          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <Input 
              placeholder="Nome do cliente ou código"
              {...register("cliente")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Data Inicial</Label>
              <Input type="date" {...register("dataInicio")} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Data Final</Label>
              <Input type="date" {...register("dataFim")} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox 
              checked={historicoCompras}
              onCheckedChange={(checked) => setValue("historicoCompras", checked)}
            />
            <Label>Incluir histórico de compras</Label>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Gerar Relatório
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
