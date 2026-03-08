import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  subtitle?: string;
}

export function KpiCard({ title, value, icon: Icon, gradient, subtitle }: KpiCardProps) {
  return (
    <div className="kpi-card flex items-start gap-4">
      <div className={`${gradient} rounded-xl p-3 shrink-0`}>
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold tracking-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
