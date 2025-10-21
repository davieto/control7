import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const vendaSchema = z.object({
  cliente: z.string().min(1, "Cliente obrigatório"),
  observacoes: z.string().optional(),
  formaPagamento: z.enum(["dinheiro", "pix", "cartao_debito", "cartao_credito", "parcelado"]),
});

type VendaFormData = z.infer<typeof vendaSchema>;

interface ItemVenda {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

interface VendaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientes: Array<{ id: number; nome: string }>;
  produtos: Array<{ id: number; descricao: string; preco: number; estoque: number }>;
  onSave: (data: VendaFormData & { itens: ItemVenda[]; total: number }) => void;
}

export const VendaDialog = ({ open, onOpenChange, clientes, produtos, onSave }: VendaDialogProps) => {
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VendaFormData>({
    resolver: zodResolver(vendaSchema),
  });

  const cliente = watch("cliente");
  const formaPagamento = watch("formaPagamento");

  const adicionarItem = () => {
    const produto = produtos.find(p => p.id.toString() === produtoSelecionado);
    if (!produto) {
      toast.error("Selecione um produto");
      return;
    }

    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }

    if (quantidade > produto.estoque) {
      toast.error(`Estoque insuficiente! Disponível: ${produto.estoque}`);
      return;
    }

    const itemExistente = itens.find(i => i.produtoId === produtoSelecionado);
    if (itemExistente) {
      toast.error("Produto já adicionado! Remova para adicionar novamente.");
      return;
    }

    const novoItem: ItemVenda = {
      produtoId: produto.id.toString(),
      produtoNome: produto.descricao,
      quantidade,
      precoUnitario: produto.preco,
      subtotal: produto.preco * quantidade,
    };

    setItens([...itens, novoItem]);
    setProdutoSelecionado("");
    setQuantidade(1);
    toast.success("Produto adicionado!");
  };

  const removerItem = (produtoId: string) => {
    setItens(itens.filter(i => i.produtoId !== produtoId));
    toast.success("Produto removido!");
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const onSubmit = (data: VendaFormData) => {
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um produto à venda");
      return;
    }

    onSave({
      ...data,
      itens,
      total: calcularTotal(),
    });
    toast.success("Venda registrada com sucesso!");
    setItens([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <Select value={cliente} onValueChange={(value) => setValue("cliente", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cliente && <p className="text-sm text-destructive">{errors.cliente.message}</p>}
            </div>

            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
              <Select value={formaPagamento} onValueChange={(value: any) => setValue("formaPagamento", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
              {errors.formaPagamento && <p className="text-sm text-destructive">{errors.formaPagamento.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" {...register("observacoes")} rows={2} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Adicionar Produtos</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <Label>Produto</Label>
                <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.descricao} - R$ {p.preco.toFixed(2)} (Est: {p.estoque})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Qtd.</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={quantidade} 
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={adicionarItem} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {itens.length > 0 && (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-center">Qtd.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itens.map((item) => (
                      <TableRow key={item.produtoId}>
                        <TableCell>{item.produtoNome}</TableCell>
                        <TableCell className="text-right">R$ {item.precoUnitario.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{item.quantidade}</TableCell>
                        <TableCell className="text-right font-semibold">R$ {item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removerItem(item.produtoId)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        R$ {calcularTotal().toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={itens.length === 0}>
              Finalizar Venda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
