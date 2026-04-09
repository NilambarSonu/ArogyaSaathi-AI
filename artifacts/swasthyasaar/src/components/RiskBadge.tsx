import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const styles = {
    LOW: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    MEDIUM: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    HIGH: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    CRITICAL: "bg-red-600 text-white border-red-700 animate-critical-pulse",
  };

  const badgeStyle = styles[level as keyof typeof styles] || styles.LOW;

  return (
    <Badge 
      variant="outline" 
      className={cn("font-bold tracking-wider text-xs", badgeStyle, className)}
    >
      {level}
    </Badge>
  );
}
