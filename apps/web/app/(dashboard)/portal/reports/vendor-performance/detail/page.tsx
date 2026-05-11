'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useVendorDetail } from '@/hooks/api/use-vendor-performance';
import { VendorPerformanceFilter } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Truck,
  Timer,
  CheckCircle2,
  AlertTriangle,
  ListFilter,
  History,
  Edit2,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/api/use-auth';
import { UserRole } from '@repo/types';
import { format } from 'date-fns';
import { AdjustmentBadge } from '../components/adjustment-badge';
import { AdjustmentDialog } from '../components/adjustment-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { RoleGuard } from '@/components/auth/role-guard';

function VendorDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const vendorIdStr = searchParams.get('vendorId');
  const vendorId = vendorIdStr ? parseInt(vendorIdStr, 10) : null;

  const filter = React.useMemo<VendorPerformanceFilter>(() => {
    return {
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      granularity:
        (searchParams.get('granularity') as 'daily' | 'monthly' | 'yearly') ||
        'daily',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };
  }, [searchParams]);

  const { data: detail, isLoading } = useVendorDetail(vendorId, filter);

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

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col h-full min-h-[500px] items-center justify-center space-y-4">
        <div className="text-muted-foreground">
          Failed to load vendor details or vendor not found.
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
        UserRole.SECTION_HEAD,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {detail.company_name}
                </h1>
                <Badge
                  variant="outline"
                  className="rounded-sm px-2 py-0.5 font-mono text-[10px] bg-muted/30"
                >
                  {detail.vendor_code}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 px-2.5 py-1 rounded-md bg-primary/5 border border-primary/10 w-fit">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary/80 uppercase tracking-tight">
                  Period: {filter.dateFrom || '-'} — {filter.dateTo || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Timer className="h-5 w-5 text-muted-foreground" />
                Performance Overview
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-none bg-muted/30 shadow-none">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <ListFilter className="h-3 w-3" />
                      Total Check-in
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-3xl font-bold">
                      {detail.stats.total_checkins}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-muted/30 shadow-none">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Timer className="h-3 w-3" />
                      Avg Lead Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-3xl font-bold">
                      {detail.stats.avg_lead_time}m
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

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
                      getRateColor(detail.stats.on_time_arrival_rate),
                    )}
                  >
                    {detail.stats.on_time_arrival_rate}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg border bg-card">
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
                      'font-mono text-sm px-2 py-0.5',
                      getRateColor(detail.stats.on_time_departure_rate),
                    )}
                  >
                    {detail.stats.on_time_departure_rate}%
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
                      getRateColor(detail.stats.compliance_rate),
                    )}
                  >
                    {detail.stats.compliance_rate}%
                  </Badge>
                </div>
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

          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                History Check-in
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase font-bold tracking-tighter">
                Last {detail.entries?.length || 0} Entries
              </span>
            </div>

            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
                {!detail.entries || detail.entries.length === 0 ? (
                  <div className="text-center py-10 text-sm text-muted-foreground border rounded-lg border-dashed">
                    No check-in history for this period.
                  </div>
                ) : (
                  detail.entries.map((entry: any) => (
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
                              onClick={() => {
                                setSelectedEntry(entry);
                                setIsAdjustmentOpen(true);
                              }}
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
        </div>
      </div>

      <AdjustmentDialog
        entry={selectedEntry}
        isOpen={isAdjustmentOpen}
        onClose={() => {
          setIsAdjustmentOpen(false);
          setSelectedEntry(null);
        }}
      />
    </RoleGuard>
  );
}

export default function VendorDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-[500px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VendorDetailContent />
    </Suspense>
  );
}
