'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { VerificationSheet } from '@/app/(dashboard)/portal/dashboard/components/verification-sheet';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { QueueStatus } from '@repo/types';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { CheckoutSheet } from './checkout-sheet';
import { useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/app/(dashboard)/components/status-badge';

interface QueueTableProps {
  checkins: any[]; // Replace any with proper type
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalRecords: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export function QueueTable({
  checkins,
  isLoading,
  page,
  totalPages,
  totalRecords,
  setPage,
  limit,
  setLimit,
}: QueueTableProps) {
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['verification-list'] });
  };

  return (
    <div className="space-y-4 flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Antrean</TableHead>
            <TableHead>Perusahaan</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          ) : checkins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Tidak ada data ditemukan
              </TableCell>
            </TableRow>
          ) : (
            checkins.map((checkin: any) => (
              <TableRow key={checkin.queue_number}>
                <TableCell className="font-medium">
                  {checkin.queue_number}
                </TableCell>
                <TableCell>{checkin.snapshot_company_name}</TableCell>
                <TableCell>{checkin.driver_name}</TableCell>
                <TableCell>{checkin.snapshot_category_name}</TableCell>
                <TableCell>
                  {checkin.submission_time
                    ? format(
                        new Date(checkin.submission_time),
                        'dd MMM HH:mm',
                        {
                          locale: id,
                        },
                      )
                    : '-'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={checkin.current_status} />
                </TableCell>
                <TableCell className="text-right">
                  {checkin.current_status === QueueStatus.MENUNGGU && (
                    <VerificationSheet
                      checkin={{
                        id: checkin.queue_number,
                        company: checkin.snapshot_company_name,
                        driver: checkin.driver_name,
                        category: checkin.snapshot_category_name,
                        time: checkin.submission_time,
                        status: checkin.current_status.toLowerCase(),
                      }}
                      trigger={<Button size="sm">Verifikasi</Button>}
                      onSuccess={handleSuccess}
                    />
                  )}

                  {checkin.current_status === QueueStatus.DISETUJUI && (
                    <CheckoutSheet
                      checkin={{
                        id: checkin.queue_number,
                        company: checkin.snapshot_company_name,
                        driver: checkin.driver_name,
                        category: checkin.snapshot_category_name,
                        time: checkin.submission_time,
                        status: checkin.current_status.toLowerCase(),
                      }}
                      trigger={
                        <Button size="sm" variant="secondary">
                          Check-Out
                        </Button>
                      }
                      onSuccess={handleSuccess}
                    />
                  )}

                  {checkin.current_status === QueueStatus.SELESAI && (
                    <VerificationSheet
                      checkin={{
                        id: checkin.queue_number,
                        company: checkin.snapshot_company_name,
                        driver: checkin.driver_name,
                        category: checkin.snapshot_category_name,
                        time: checkin.submission_time,
                        status: checkin.current_status.toLowerCase(),
                      }}
                      trigger={
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      }
                      readonly={true}
                    />
                  )}

                  {checkin.current_status === QueueStatus.DITOLAK && (
                    <VerificationSheet
                      checkin={{
                        id: checkin.queue_number,
                        company: checkin.snapshot_company_name,
                        driver: checkin.driver_name,
                        category: checkin.snapshot_category_name,
                        time: checkin.submission_time,
                        status: checkin.current_status.toLowerCase(),
                      }}
                      trigger={
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      }
                      readonly={true}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {totalRecords} data
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
            Halaman {page} dari {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPage(1)}
              disabled={page <= 1 || isLoading}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || isLoading}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || isLoading}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages || isLoading}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
