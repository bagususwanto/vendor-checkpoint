'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useReportExportLogs } from '@/hooks/api/use-report-export-log';
import { Button } from '@/components/ui/button';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LogReportExportPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [page, setPage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(10);

  const filter = React.useMemo(() => {
    return {
      dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      page,
      limit,
    };
  }, [date, page, limit]);

  const { data: exportLogsData, isLoading } = useReportExportLogs(filter);

  const handleReset = () => {
    setDate({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
    setPage(1);
    setLimit(10);
  };

  const hasFilters = !!date;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Export</h2>
          <p className="text-muted-foreground text-sm">
            Kelola dan lihat riwayat export laporan sistem.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Riwayat Export</CardTitle>
          <CardDescription>
            Tabel berikut menampilkan riwayat file laporan yang telah di-export.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <DatePickerWithRange
                date={date}
                setDate={setDate}
                className="w-auto"
              />

              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : exportLogsData?.data.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
              <p className="text-muted-foreground">
                Tidak ada riwayat export ditemukan
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Waktu Export</TableHead>
                      <TableHead className="w-[150px]">User</TableHead>
                      <TableHead className="w-[120px]">Tipe Report</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead className="w-[100px]">Records</TableHead>
                      <TableHead>Nama File</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportLogsData?.data.map((log) => (
                      <TableRow key={log.export_id}>
                        <TableCell className="font-medium">
                          {format(
                            new Date(log.export_time),
                            'dd MMM yyyy HH:mm',
                            {
                              locale: id,
                            },
                          )}
                        </TableCell>
                        <TableCell>{log.user?.full_name || '-'}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            {log.report_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(log.date_from), 'dd/MM/yyyy')} -{' '}
                          {format(new Date(log.date_to), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{log.total_records}</TableCell>
                        <TableCell
                          className="max-w-[200px] truncate"
                          title={log.file_name}
                        >
                          {log.file_name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                  Total {exportLogsData?.meta.total || 0} data
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Baris per halaman</p>
                    <Select
                      value={`${limit}`}
                      onValueChange={(value) => {
                        setLimit(Number(value));
                        setPage(1);
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
                    Halaman {exportLogsData?.meta.page || 1} dari{' '}
                    {exportLogsData?.meta.totalPages || 0}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => setPage(1)}
                      disabled={page <= 1}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= (exportLogsData?.meta.totalPages || 0)}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() =>
                        setPage(exportLogsData?.meta.totalPages || 1)
                      }
                      disabled={page >= (exportLogsData?.meta.totalPages || 0)}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
