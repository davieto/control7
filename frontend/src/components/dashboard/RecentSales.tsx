import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 1. Definição da Interface (Estrutura do dado que vem do Django)
// Deve ser idêntica ao que a lista_vendas_recentes retorna na views.py
interface VendaRecente {
    id: number; // O ID real da venda, não precisa ser formatado como '#12345' aqui
    cliente_nome: string;
    valor: number;
    status: string;
    data_formatada: string; // Ex: "Hoje às 14:32"
}

// 2. Definição da Propriedade (O componente espera receber a lista de vendas)
interface RecentSalesProps {
    vendas: VendaRecente[];
}

// 3. O componente agora recebe 'vendas' como prop
export const RecentSales = ({ vendas }: RecentSalesProps) => {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 4. Mapeia sobre a lista de vendas DINÂMICA (vinda das props) */}
          {vendas && vendas.length > 0 ? (
            vendas.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{sale.cliente_nome}</p>
                  {/* Usa o ID real (number) e a data formatada que veio do Django */}
                  <p className="text-sm text-muted-foreground">#{sale.id} • {sale.data_formatada}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  {/* Formata o valor de número para moeda aqui no frontend */}
                  <p className="font-bold text-foreground">
                    R$ {sale.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant={sale.status === "PAGO" ? "default" : "secondary"}>
                    {/* Exibe o status (PAGO, PENDENTE, etc.) */}
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
             <p className="text-muted-foreground text-center py-4">Nenhuma venda recente para exibir.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};