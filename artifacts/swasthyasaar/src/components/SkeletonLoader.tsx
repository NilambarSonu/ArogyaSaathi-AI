import { Card } from "@/components/ui/card";

export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4 bg-card border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}
