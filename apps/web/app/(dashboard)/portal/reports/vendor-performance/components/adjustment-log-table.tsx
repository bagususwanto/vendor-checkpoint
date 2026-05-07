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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Trash2,
  User,
  Calendar,
} from 'lucide-react';
import { useDeleteAdjustment } from '@/hooks/api/use-performance-adjustment';
import { PerformanceAdjustment, UserRole } from '@repo/types';
import { formatDateTime } from '@/lib/utils';
import { useUser } from '@/hooks/api/use-auth';
import { cn } from '@/lib/utils';

interface AdjustmentLogTableProps {
  data: PerformanceAdjustment[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function AdjustmentLogTable({
  data,
  isLoading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: AdjustmentLogTableProps) {
  const { user } = useUser();
  const deleteMutation = useDeleteAdjustment();

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'On-Time': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Late': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Unscheduled': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Belum ada data log adjustment ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Waktu & No. Queue</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Penyesuaian</TableHead>
              <TableHead>Alasan</TableHead>
              <TableHead className="w-[150px]">Oleh</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const canDelete = 
                user?.role === UserRole.SUPER_ADMIN || 
                user?.user_id === item.adjusted_by_user_id;

              return (
                <TableRow key={item.adjustment_id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Badge variant="outline" className="h-5 px-1 font-mono">
                          #{item.entry?.queue_number}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(item.created_at as any)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.entry?.snapshot_company_name}</span>
                      <span className="text-[10px] text-muted-foreground">Driver: {item.entry?.driver_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.adjusted_arrival_status && (
                        <div className="flex items-center gap-1">
                           <span className="text-[9px] uppercase font-bold text-muted-foreground">Arr:</span>
                           <Badge variant="outline" className={cn("text-[9px] px-1 py-0 h-4 border", getStatusColor(item.adjusted_arrival_status))}>
                            {item.adjusted_arrival_status}
                          </Badge>
                        </div>
                      )}
                      {item.adjusted_departure_status && (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Dep:</span>
                          <Badge variant="outline" className={cn("text-[9px] px-1 py-0 h-4 border", getStatusColor(item.adjusted_departure_status))}>
                            {item.adjusted_departure_status}
                          </Badge>
                        </div>
                      )}
                      {item.adjusted_ppe_compliant !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Safety:</span>
                          <Badge className={cn("text-[9px] px-1 h-4", item.adjusted_ppe_compliant ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                            {item.adjusted_ppe_compliant ? "Safe" : "Unsafe"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs italic text-muted-foreground line-clamp-2 max-w-[250px]">
                      "{item.adjustment_reason}"
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {item.adjusted_by_user?.full_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            title="Hapus Adjustment"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Adjustment?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Menghapus data ini akan mengembalikan metrik performa vendor pada Queue 
                              <span className="font-bold"> #{item.entry?.queue_number} </span> 
                              ke nilai aslinya.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(item.adjustment_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hapus'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-xs text-muted-foreground">Total {total} adjustment</div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-xs font-medium">Baris per halaman</p>
            <Select
              value={`${limit}`}
              onValueChange={(value) => onLimitChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-xs font-medium">
            Hal {page} dari {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
