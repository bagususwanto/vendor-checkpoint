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
import { AuditLog } from '@/services/audit-log.service';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Eye,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatDateTime } from '@/lib/utils';
import { AuditLogDetailSheet } from './audit-log-detail-sheet';

interface AuditLogTableProps {
  data: AuditLog[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function AuditLogTable({
  data,
  isLoading,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
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
        <p className="text-muted-foreground">
          Tidak ada data audit log ditemukan
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Waktu</TableHead>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="w-[100px]">Ref ID</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((log) => (
                <TableRow
                  key={log.audit_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetail(log)}
                >
                  <TableCell className="font-medium">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>{log.user?.full_name || '-'}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {log.action_type}
                    </span>
                  </TableCell>
                  <TableCell
                    className="max-w-[300px] truncate"
                    title={log.action_description}
                  >
                    {log.action_description}
                  </TableCell>
                  <TableCell>
                    {log.entry?.queue_number || log.entry_id || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(log);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Lihat Detail</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Total {total} data
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Baris per halaman</p>
              <Select
                value={`${limit}`}
                onValueChange={(value) => {
                  onLimitChange(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Halaman {page} dari {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(totalPages)}
                disabled={page === totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuditLogDetailSheet
        log={selectedLog}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
