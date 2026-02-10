'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChecklistBreakdown } from '@/hooks/api/use-dashboard';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function ChecklistBreakdown() {
  const { data: breakdown, isLoading } = useChecklistBreakdown();

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Checklist Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!breakdown || breakdown.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Checklist Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Tidak ada data checklist hari ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Checklist Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {breakdown.map((category) => {
            const Icon =
              category.icon_name && (LucideIcons as any)[category.icon_name]
                ? (LucideIcons as any)[category.icon_name]
                : null;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className={cn('w-4 h-4', category.color)} />}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {category.compliant_items} / {category.total_items} Item Ok
                  </span>
                </div>
                <Progress
                  value={category.compliance_rate}
                  indicatorClassName={cn(
                    'bg-current',
                    category.color || 'text-status-info-fg',
                  )}
                  className="h-2"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {category.compliance_rate}% Compliance
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
