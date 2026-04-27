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
import { Loader2, Truck, Timer, CheckCircle2, AlertTriangle, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface VendorDetailSheetProps {
  vendorId: number | null;
  isOpen: boolean;
  onClose: () => void;
  filter: VendorPerformanceFilter;
}

export function VendorDetailSheet({ vendorId, isOpen, onClose, filter }: VendorDetailSheetProps) {
  const { data: detail, isLoading } = useVendorDetail(vendorId, filter);

  const getRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600 bg-emerald-50';
    if (rate >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="pb-6">
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
          <SheetDescription className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-4 w-[150px]" />
            ) : (
              <>
                <Badge variant="secondary" className="rounded-sm px-1 font-normal uppercase text-[10px]">
                  {detail?.category_name}
                </Badge>
                <span>ID: {detail?.vendor_id}</span>
              </>
            )}
          </SheetDescription>
        </SheetHeader>

        <Separator className="mb-6" />

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : detail ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none bg-muted/30 shadow-none">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                    <ListFilter className="h-3 w-3" />
                    Total Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-2xl font-bold">{detail.stats.total_checkins}</div>
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
                  <div className="text-2xl font-bold">{detail.stats.avg_lead_time}m</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold px-1">Tingkat Keberhasilan</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">On-Time Arrival</span>
                  </div>
                  <Badge className={cn("font-mono", getRateColor(detail.stats.on_time_arrival_rate))}>
                    {detail.stats.on_time_arrival_rate}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">On-Time Departure</span>
                  </div>
                  <Badge className={cn("font-mono", getRateColor(detail.stats.on_time_departure_rate))}>
                    {detail.stats.on_time_departure_rate}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Compliance Rate</span>
                  </div>
                  <Badge className={cn("font-mono", getRateColor(detail.stats.compliance_rate))}>
                    {detail.stats.compliance_rate}%
                  </Badge>
                </div>
              </div>
            </div>

            {detail.stats.missed_cycles > 0 && (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">Peringatan: Missed Cycle</h4>
                  <p className="text-xs text-rose-700 mt-1">
                    Vendor ini telah melewatkan {detail.stats.missed_cycles} jadwal pengiriman pada periode ini.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Gagal memuat detail vendor.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <span className={cn("animate-pulse rounded-md bg-muted inline-block", className)} />;
}
