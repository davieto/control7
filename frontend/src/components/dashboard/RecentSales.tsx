import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentSales = [
  { id: "#12345", cliente: "João Silva", valor: "R$ 1.234,56", status: "Pago", data: "Hoje às 14:32" },
  { id: "#12344", cliente: "Maria Santos", valor: "R$ 856,90", status: "Pendente", data: "Hoje às 11:15" },
  { id: "#12343", cliente: "Pedro Costa", valor: "R$ 2.450,00", status: "Pago", data: "Ontem às 16:45" },
  { id: "#12342", cliente: "Ana Oliveira", valor: "R$ 678,30", status: "Pago", data: "Ontem às 10:20" },
];

export const RecentSales = () => {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">{sale.cliente}</p>
                <p className="text-sm text-muted-foreground">{sale.id} • {sale.data}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <p className="font-bold text-foreground">{sale.valor}</p>
                <Badge variant={sale.status === "Pago" ? "default" : "secondary"}>
                  {sale.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
