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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Timer,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface VendorRankingTableProps {
  data: VendorRankingData[] | undefined;
  isLoading: boolean;
  total: number;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onVendorClick: (vendorId: number) => void;
  onSort: (column: string) => void;
}

export function VendorRankingTable({
  data,
  isLoading,
  total,
  page,
  limit,
  sortBy,
  sortOrder,
  onPageChange,
  onLimitChange,
  onVendorClick,
  onSort,
}: VendorRankingTableProps) {
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance Ranking</CardTitle>
          <CardDescription>Based on arrival timeliness</CardDescription>
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
        <CardTitle>Vendor Performance Ranking</CardTitle>
        <CardDescription>
          {sortBy === 'on_time_arrival_rate' ? 'Sorted by Arrival' : 
           sortBy === 'on_time_departure_rate' ? 'Sorted by Departure' :
           sortBy === 'compliance_rate' ? 'Sorted by Compliance' : 
           'Based on arrival timeliness'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[60px] text-center">Rank</TableHead>
                <TableHead className="min-w-[200px]">Vendor</TableHead>
                <TableHead className="text-right">Total Check-in</TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onSort('on_time_arrival_rate')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Arrival
                    {sortBy === 'on_time_arrival_rate' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onSort('on_time_departure_rate')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Departure
                    {sortBy === 'on_time_departure_rate' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-center cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => onSort('compliance_rate')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Compliance
                    {sortBy === 'compliance_rate' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Avg Lead Time</TableHead>
                <TableHead className="text-center">Missed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item, index) => {
                  const absoluteRank = (page - 1) * limit + index + 1;
                  return (
                    <TableRow
                      key={item.vendor_id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => onVendorClick(item.vendor_id)}
                    >
                      <TableCell className="text-center font-medium">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs',
                            absoluteRank === 1
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 font-bold'
                              : absoluteRank === 2
                                ? 'bg-slate-100 text-slate-700 border border-slate-200 font-bold'
                                : absoluteRank === 3
                                  ? 'bg-orange-100 text-orange-700 border border-orange-200 font-bold'
                                  : 'text-muted-foreground',
                          )}
                        >
                          {absoluteRank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold group-hover:text-primary transition-colors">
                            {item.company_name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono tracking-wider">
                            {item.vendor_code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{item.total_checkins}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn('font-mono', getRateColor(item.on_time_arrival_rate))}
                        >
                          {item.on_time_arrival_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn('font-mono', getRateColor(item.on_time_departure_rate))}
                        >
                          {item.on_time_departure_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn('font-mono', getRateColor(item.compliance_rate))}
                        >
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
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No vendor data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex-1 text-sm text-muted-foreground">Total {total} vendor records</div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${limit}`}
                onValueChange={(value) => {
                  onLimitChange(Number(value));
                  onPageChange(1); // Reset to first page when limit changes
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(1)}
                disabled={page === 1}
              >
                <span className="sr-only">First page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(totalPages)}
                disabled={page === totalPages || totalPages === 0}
              >
                <span className="sr-only">Last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
