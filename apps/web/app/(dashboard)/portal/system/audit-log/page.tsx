'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { AuditLogFilterForm } from './components/audit-log-filter-form';
import { AuditLogTable } from './components/audit-log-table';
import { useAuditLogs, useExportAuditLogs } from '@/hooks/api/use-audit-log';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AuditLogPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [actionType, setActionType] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const filter = React.useMemo(() => {
    return {
      dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      actionType: actionType === 'ALL' ? undefined : actionType,
      page,
      limit,
    };
  }, [date, actionType, page, limit]);

  const { data: auditLogsData, isLoading } = useAuditLogs(filter);
  const { mutate: exportAuditLogs, isPending: isExporting } =
    useExportAuditLogs();

  const handleExport = () => {
    if (!date?.from || !date?.to) {
      toast.error('Silakan pilih periode tanggal terlebih dahulu');
      return;
    }

    exportAuditLogs(filter, {
      onSuccess: () => {
        toast.success('Audit Log berhasil di-download');
      },
      onError: () => {
        toast.error('Gagal download audit log');
      },
    });
  };

  const handleReset = () => {
    setDate({
      from: addDays(new Date(), -7),
      to: new Date(),
    });
    setActionType('');
    setPage(1);
    setLimit(10);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground text-sm">
            Monitor aktivitas dan perubahan data dalam sistem.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleExport}
            disabled={isExporting || isLoading || !auditLogsData?.data.length}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DownloadIcon className="mr-2 h-4 w-4" />
            )}
            Download Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Audit Log</CardTitle>
          <CardDescription>
            Tabel berikut menampilkan riwayat aktivitas pengguna dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuditLogFilterForm
            date={date}
            setDate={setDate}
            actionType={actionType}
            setActionType={(val) => {
              setActionType(val);
              setPage(1);
            }}
            onReset={handleReset}
          />

          <AuditLogTable
            data={auditLogsData?.data || []}
            isLoading={isLoading}
            page={auditLogsData?.meta.page || 1}
            limit={limit}
            total={auditLogsData?.meta.total || 0}
            totalPages={auditLogsData?.meta.totalPages || 0}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
