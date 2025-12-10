import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "",
  success: "border-emerald-500/20",
  warning: "border-yellow-500/20",
  danger: "border-red-500/20",
};

const trendIcons = {
  up: <TrendingUp className="h-3 w-3 text-emerald-400" />,
  down: <TrendingDown className="h-3 w-3 text-red-400" />,
  neutral: <Minus className="h-3 w-3 text-muted-foreground" />,
};

export function KpiCard({
  title,
  value,
  trend,
  trendValue,
  icon,
  variant = "default",
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        "hover-elevate transition-all duration-150",
        variantStyles[variant],
        className
      )}
      data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && trendValue && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {trendIcons[trend]}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
