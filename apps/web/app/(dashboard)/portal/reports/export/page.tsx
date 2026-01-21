'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ReportFilterForm } from '@/components/reports/report-filter-form';
import { ReportPreview } from '@/components/reports/report-preview';
import { useReportPreview, useExportReport } from '@/hooks/api/use-report';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [status, setStatus] = React.useState<string>('');
  const [materialCategoryId, setMaterialCategoryId] = React.useState<
    string | undefined
  >(undefined);

  const filter = React.useMemo(() => {
    return {
      dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      status: status === 'ALL' ? undefined : status,
      materialCategoryId: materialCategoryId
        ? parseInt(materialCategoryId)
        : undefined,
    };
  }, [date, status, materialCategoryId]);

  const { data: previewData, isLoading: isPreviewLoading } =
    useReportPreview(filter);

  const { mutate: exportReport, isPending: isExporting } = useExportReport();

  const handleExport = () => {
    if (!date?.from || !date?.to) {
      toast.error('Silakan pilih periode tanggal terlebih dahulu');
      return;
    }

    exportReport(filter, {
      onSuccess: () => {
        toast.success('Report berhasil di-download');
      },
      onError: () => {
        toast.error('Gagal download report');
      },
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Export Laporan</h2>
          <p className="text-muted-foreground">
            Download laporan check-in vendor dalam format Excel
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport} disabled={isExporting || !previewData}>
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

      <ReportFilterForm
        date={date}
        setDate={setDate}
        status={status}
        setStatus={setStatus}
        materialCategoryId={materialCategoryId}
        setMaterialCategoryId={setMaterialCategoryId}
      />

      <ReportPreview data={previewData} isLoading={isPreviewLoading} />
    </div>
  );
}
