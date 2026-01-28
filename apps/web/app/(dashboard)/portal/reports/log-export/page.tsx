'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { AuditLogFilterForm } from './components/audit-log-filter-form';
import { AuditLogTable } from './components/audit-log-table';
import { useAuditLogs, useExportAuditLogs } from '@/hooks/api/use-audit-log';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function LogReportExportPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [actionType, setActionType] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);

  const filter = React.useMemo(() => {
    return {
      dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      actionType: actionType === 'ALL' ? undefined : actionType,
      page,
      limit: 10,
    };
  }, [date, actionType, page]);

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
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Export</h2>
          <p className="text-muted-foreground">
            Monitor dan download log aktivitas sistem
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
      <Separator />

      <AuditLogFilterForm
        date={date}
        setDate={setDate}
        actionType={actionType}
        setActionType={(val) => {
          setActionType(val);
          setPage(1); // Reset page on filter change
        }}
        onReset={handleReset}
      />

      <AuditLogTable
        data={auditLogsData?.data || []}
        isLoading={isLoading}
        page={auditLogsData?.meta.page || 1}
        totalPages={auditLogsData?.meta.totalPages || 0}
        onPageChange={setPage}
      />
    </div>
  );
}
