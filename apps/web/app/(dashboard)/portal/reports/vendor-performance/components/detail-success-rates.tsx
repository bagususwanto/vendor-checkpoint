'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Truck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailSuccessRatesProps {
  onTimeArrivalRate: number;
  onTimeDepartureRate: number;
  complianceRate: number;
  missedCycles: number;
}

export function DetailSuccessRates({ 
  onTimeArrivalRate, 
  onTimeDepartureRate, 
  complianceRate, 
  missedCycles 
}: DetailSuccessRatesProps) {
  
  const getRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600 bg-emerald-50';
    if (rate >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold px-1">Success Rates</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">On-Time Arrival</span>
          </div>
          <Badge
            className={cn(
              'font-mono text-sm px-2 py-0.5',
              getRateColor(onTimeArrivalRate),
            )}
          >
            {onTimeArrivalRate}%
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">On-Time Departure</span>
          </div>
          <Badge
            className={cn(
              'font-mono text-sm px-2 py-0.5',
              getRateColor(onTimeDepartureRate),
            )}
          >
            {onTimeDepartureRate}%
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100 text-amber-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Compliance Rate</span>
          </div>
          <Badge
            className={cn(
              'font-mono text-sm px-2 py-0.5',
              getRateColor(complianceRate),
            )}
          >
            {complianceRate}%
          </Badge>
        </div>
      </div>

      {missedCycles > 0 && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">
              Warning: Missed Cycle
            </h4>
            <p className="text-xs text-rose-700 mt-1">
              This vendor has missed {missedCycles} delivery
              schedules in this period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
