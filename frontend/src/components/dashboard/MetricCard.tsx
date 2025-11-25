import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  variant?: "default" | "primary" | "success" | "warning";
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "up",
  variant = "default" 
}: MetricCardProps) => {
  return (
    <Card className={cn(
      "p-6 shadow-medium hover:shadow-large transition-all duration-300",
      variant === "primary" && "border-primary/20 bg-gradient-to-br from-card to-primary/5"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
          <p className={cn(
            "text-sm mt-2 font-medium",
            trend === "up" ? "text-success" : "text-destructive"
          )}>
            {change}
          </p>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === "primary" ? "bg-gradient-primary text-primary-foreground" :
          variant === "success" ? "bg-success/10 text-success" :
          variant === "warning" ? "bg-warning/10 text-warning" :
          "bg-muted text-muted-foreground"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
