'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useVendorDetail } from '@/hooks/api/use-vendor-performance';
import { VendorPerformanceFilter } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Truck,
  Timer,
  CheckCircle2,
  AlertTriangle,
  ListFilter,
  History,
  Edit2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/hooks/api/use-auth';
import { UserRole } from '@repo/types';
import { format } from 'date-fns';
import { AdjustmentBadge } from './adjustment-badge';
import { AdjustmentDialog } from './adjustment-dialog';
import { Button } from '@/components/ui/button';

interface VendorDetailSheetProps {
  vendorId: number | null;
  isOpen: boolean;
  onClose: () => void;
  filter: VendorPerformanceFilter;
}

export function VendorDetailSheet({
  vendorId,
  isOpen,
  onClose,
  filter,
}: VendorDetailSheetProps) {
  const { data: detail, isLoading } = useVendorDetail(vendorId, filter);
  const { user } = useUser();
  const [selectedEntry, setSelectedEntry] = React.useState<any>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = React.useState(false);

  const canAdjust =
    user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.SECTION_HEAD;

  const getRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600 bg-emerald-50';
    if (rate >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

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
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-[800px] overflow-y-auto p-0">
          <div className="p-6">
            <SheetHeader className="pb-6 p-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                <ListFilter className="h-3 w-3" />
                Vendor Detail
              </div>
              <SheetTitle className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-[250px]" />
                ) : (
                  detail?.company_name
                )}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 flex-wrap">
                {isLoading ? (
                  <Skeleton className="h-4 w-[150px]" />
                ) : (
                  <>
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal uppercase text-[10px]"
                    >
                      {detail?.category_name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-sm px-1 font-mono text-[10px] bg-muted/30"
                    >
                      Code: {detail?.vendor_code}
                    </Badge>
                  </>
                )}
              </SheetDescription>
            </SheetHeader>

            <Separator className="my-6" />

            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : detail ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none bg-muted/30 shadow-none">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                        <ListFilter className="h-3 w-3" />
                        Total Check-in
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold">
                        {detail.stats.total_checkins}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-muted/30 shadow-none">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                        <Timer className="h-3 w-3" />
                        Avg Lead Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-2xl font-bold">
                        {detail.stats.avg_lead_time}m
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold px-1">
                    Success Rates
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                          <Truck className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">
                          On-Time Arrival
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          'font-mono',
                          getRateColor(detail.stats.on_time_arrival_rate),
                        )}
                      >
                        {detail.stats.on_time_arrival_rate}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <Truck className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">
                          On-Time Departure
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          'font-mono',
                          getRateColor(detail.stats.on_time_departure_rate),
                        )}
                      >
                        {detail.stats.on_time_departure_rate}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">
                          Compliance Rate
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          'font-mono',
                          getRateColor(detail.stats.compliance_rate),
                        )}
                      >
                        {detail.stats.compliance_rate}%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History Check-in
                    </h3>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                      Last {detail.entries?.length || 0} Entries
                    </span>
                  </div>

                  <div className="space-y-3">
                    {!detail.entries || detail.entries.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground border rounded-lg border-dashed">
                        No check-in history for this period.
                      </div>
                    ) : (
                      detail.entries.map((entry: any) => (
                        <div
                          key={entry.entry_id}
                          className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                #{entry.queue_number}
                                <AdjustmentBadge
                                  adjustment={entry.adjustment}
                                />
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {format(
                                  new Date(entry.submission_time),
                                  'dd MMM yyyy, HH:mm',
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {canAdjust && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => {
                                    setSelectedEntry(entry);
                                    setIsAdjustmentOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[9px] px-1 py-0 h-4 border',
                                  getStatusColor(entry.arrival_status),
                                )}
                              >
                                {entry.arrival_status}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dashed">
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                                Safety Compliance
                              </span>
                              <div className="flex items-center gap-1.5">
                                {entry.is_compliant ? (
                                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] px-1 h-4">
                                    Compliant
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="destructive"
                                    className="text-[9px] px-1 h-4"
                                  >
                                    Non-Compliant
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                                Departure
                              </span>
                              <div className="flex items-center gap-1.5">
                                {entry.departure_status ? (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-[9px] px-1 py-0 h-4 border',
                                      getStatusColor(entry.departure_status),
                                    )}
                                  >
                                    {entry.departure_status}
                                  </Badge>
                                ) : (
                                  <span className="text-[9px] text-muted-foreground italic">
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

                {detail.stats.missed_cycles > 0 && (
                  <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">
                        Warning: Missed Cycle
                      </h4>
                      <p className="text-xs text-rose-700 mt-1">
                        This vendor has missed {detail.stats.missed_cycles} delivery
                        schedules in this period.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Failed to load vendor details.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AdjustmentDialog
        entry={selectedEntry}
        isOpen={isAdjustmentOpen}
        onClose={() => {
          setIsAdjustmentOpen(false);
          setSelectedEntry(null);
        }}
      />
    </>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'animate-pulse rounded-md bg-muted inline-block',
        className,
      )}
    />
  );
}
