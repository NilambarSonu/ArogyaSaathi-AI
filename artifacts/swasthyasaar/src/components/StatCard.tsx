import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, icon, description, className, valueClassName }: StatCardProps) {
  return (
    <Card className={cn("p-5 hover-lift bg-card border-border shadow-sm", className)}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className={cn("text-3xl font-bold font-mono text-foreground", valueClassName)}>{value}</h2>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </Card>
  );
}
