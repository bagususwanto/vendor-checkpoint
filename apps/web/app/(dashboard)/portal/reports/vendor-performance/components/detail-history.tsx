'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AdjustmentBadge } from './adjustment-badge';

interface DetailHistoryProps {
  entries: any[];
  canAdjust: boolean;
  onAdjust: (entry: any) => void;
}

export function DetailHistory({ entries, canAdjust, onAdjust }: DetailHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On-Time':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Late':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Overdue':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Unscheduled':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          History Check-in
        </h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase font-bold tracking-tighter">
          Last {entries?.length || 0} Entries
        </span>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
          {!entries || entries.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground border rounded-lg border-dashed">
              No check-in history for this period.
            </div>
          ) : (
            entries.map((entry: any) => (
              <div
                key={entry.entry_id}
                className="p-4 rounded-lg border bg-card/50 hover:bg-card hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2 mb-1">
                      #{entry.queue_number}
                      <AdjustmentBadge adjustment={entry.adjustment} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(
                        new Date(entry.submission_time),
                        'dd MMM yyyy, HH:mm',
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canAdjust && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onAdjust(entry)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs px-2 py-0.5 border',
                        getStatusColor(entry.arrival_status),
                      )}
                    >
                      {entry.arrival_status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-dashed bg-muted/20 -mx-4 -mb-4 p-4 rounded-b-lg">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Safety Compliance
                    </span>
                    <div className="flex items-center gap-1.5">
                      {entry.is_compliant ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-xs px-2 py-0.5">
                          Compliant
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="text-xs px-2 py-0.5"
                        >
                          Non-Compliant
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Departure
                    </span>
                    <div className="flex items-center gap-1.5">
                      {entry.departure_status ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs px-2 py-0.5 border',
                            getStatusColor(entry.departure_status),
                          )}
                        >
                          {entry.departure_status}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground italic px-1">
                          On-Site
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
