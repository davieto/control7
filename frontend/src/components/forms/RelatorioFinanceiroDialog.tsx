import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface RelatorioFinanceiroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: any) => void;
}

export function RelatorioFinanceiroDialog({ open, onOpenChange, onGenerate }: RelatorioFinanceiroDialogProps) {
  const { register, handleSubmit, reset } = useForm();

  const handleGenerate = (data: any) => {
    onGenerate(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerar Relatório Financeiro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleGenerate)} className="space-y-4">
          
          <div className="flex flex-col gap-2">
            <Label>Receitas</Label>
            <Input 
              placeholder="Ex.: Vendas, Investimentos..."
              {...register("receitas")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Despesas</Label>
            <Input 
              placeholder="Ex.: Pagamento de fornecedores, Água, Luz..."
              {...register("despesas")}
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
