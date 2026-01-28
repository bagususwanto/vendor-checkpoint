'use client';

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
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AuditLogTableProps {
  data: AuditLog[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AuditLogTable({
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: AuditLogTableProps) {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => (
              <TableRow key={log.audit_id}>
                <TableCell className="font-medium">
                  {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', {
                    locale: id,
                  })}
                </TableCell>
                <TableCell>{log.user?.full_name || '-'}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {log.action_type}
                  </span>
                </TableCell>
                <TableCell
                  className="max-w-[400px] truncate"
                  title={log.action_description}
                >
                  {log.action_description}
                </TableCell>
                <TableCell>
                  {log.entry?.queue_number || log.entry_id || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Halaman {page} dari {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
