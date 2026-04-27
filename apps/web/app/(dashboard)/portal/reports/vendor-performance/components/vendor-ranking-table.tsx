'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VendorRankingData } from '@/services/vendor-performance.service';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Timer, AlertTriangle, Truck, CheckCircle2 } from 'lucide-react';

interface VendorRankingTableProps {
  data: VendorRankingData[] | undefined;
  isLoading: boolean;
  onVendorClick: (vendorId: number) => void;
}

export function VendorRankingTable({ data, isLoading, onVendorClick }: VendorRankingTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking Performa Vendor</CardTitle>
          <CardDescription>Berdasarkan tingkat ketepatan waktu kedatangan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRateColor = (rate: number) => {
    if (rate >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (rate >= 75) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking Performa Vendor</CardTitle>
        <CardDescription>Berdasarkan tingkat ketepatan waktu kedatangan (On-Time Arrival)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[60px] text-center">Rank</TableHead>
                <TableHead className="min-w-[200px]">Vendor</TableHead>
                <TableHead className="text-right">Total Check-in</TableHead>
                <TableHead className="text-center">Arrival</TableHead>
                <TableHead className="text-center">Departure</TableHead>
                <TableHead className="text-center">Compliance</TableHead>
                <TableHead className="text-right">Avg Lead Time</TableHead>
                <TableHead className="text-center">Missed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow 
                    key={item.vendor_id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors group"
                    onClick={() => onVendorClick(item.vendor_id)}
                  >
                    <TableCell className="text-center font-medium">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs",
                        index === 0 ? "bg-yellow-100 text-yellow-700 border border-yellow-200 font-bold" :
                        index === 1 ? "bg-slate-100 text-slate-700 border border-slate-200 font-bold" :
                        index === 2 ? "bg-orange-100 text-orange-700 border border-orange-200 font-bold" :
                        "text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {item.company_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                          {item.category_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.total_checkins}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("font-mono", getRateColor(item.on_time_arrival_rate))}>
                        {item.on_time_arrival_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("font-mono", getRateColor(item.on_time_departure_rate))}>
                        {item.on_time_departure_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("font-mono", getRateColor(item.compliance_rate))}>
                        {item.compliance_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        <span>{item.avg_lead_time}m</span>
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.missed_cycles > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-rose-600 font-bold">
                          <span>{item.missed_cycles}</span>
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs font-mono">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Tidak ada data vendor ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
