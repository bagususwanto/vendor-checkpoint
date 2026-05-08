'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ReportFilterForm } from './components/report-filter-form';
import { ReportPreview } from './components/report-preview';
import { useReportPreview, useExportReport } from '@/hooks/api/use-report';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';

export default function ReportsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [status, setStatus] = React.useState<string>('');
  const [arrivalStatus, setArrivalStatus] = React.useState<string>('');
  const [departureStatus, setDepartureStatus] = React.useState<string>('');
  const [vendorCategoryId, setVendorCategoryId] = React.useState<
    string | undefined
  >(undefined);

  const filter = React.useMemo(() => {
    return {
      dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      status: status === 'ALL' ? undefined : status,
      arrivalStatus: arrivalStatus || undefined,
      departureStatus: departureStatus || undefined,
      vendorCategoryId: vendorCategoryId
        ? parseInt(vendorCategoryId)
        : undefined,
    };
  }, [date, status, arrivalStatus, departureStatus, vendorCategoryId]);

  const { data: previewData, isLoading: isPreviewLoading } =
    useReportPreview(filter);

  const { mutate: exportReport, isPending: isExporting } = useExportReport();

  const handleExport = () => {
    if (!date?.from || !date?.to) {
      toast.error('Please select a date range first');
      return;
    }

    exportReport(filter, {
      onSuccess: () => {
        toast.success('Report downloaded successfully');
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message || 'Failed to download report. Please try again.';
        toast.error('Failed to Export Report', {
          description: errorMessage,
        });
      },
    });
  };

  const handleReset = () => {
    setDate({
      from: addDays(new Date(), -7),
      to: new Date(),
    });
    setStatus('');
    setArrivalStatus('');
    setDepartureStatus('');
    setVendorCategoryId(undefined);
  };

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
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Export Report</h2>
            <p className="text-muted-foreground">
              Download vendor performance reports in Excel format
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
          arrivalStatus={arrivalStatus}
          setArrivalStatus={setArrivalStatus}
          departureStatus={departureStatus}
          setDepartureStatus={setDepartureStatus}
          vendorCategoryId={vendorCategoryId}
          setVendorCategoryId={setVendorCategoryId}
          onReset={handleReset}
        />

        <ReportPreview data={previewData} isLoading={isPreviewLoading} />
      </div>
    </RoleGuard>
  );
}
