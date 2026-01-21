'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChecklistBreakdown } from '@/hooks/api/use-dashboard';
import { cn } from '@/lib/utils';

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
          {breakdown.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span className="text-muted-foreground">
                  {category.compliant_items} / {category.total_items} Item Ok
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${category.compliance_rate}%`,
                    backgroundColor: category.color || '#3b82f6',
                  }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {category.compliance_rate}% Compliance
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
