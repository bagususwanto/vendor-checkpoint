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
import { VerificationSheet } from './verification-sheet';
import { CheckoutSheet } from '../../queue/components/checkout-sheet';
import { useVerificationList } from '@/hooks/api/use-check-in';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { QueueStatus } from '@repo/types';
import { useQueryClient } from '@tanstack/react-query';

interface CheckinListProps {
  status: QueueStatus.MENUNGGU | QueueStatus.DISETUJUI;
}

export function CheckinList({ status }: CheckinListProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useVerificationList(1, 5, undefined, {
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    status: status,
  });

  const checkins = data?.data || [];

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['verification-list'] });
  };

  return (
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
                  ? format(new Date(checkin.submission_time), 'HH:mm', {
                      locale: id,
                    })
                  : '-'}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    checkin.current_status === QueueStatus.DISETUJUI
                      ? 'default'
                      : checkin.current_status === QueueStatus.DITOLAK
                        ? 'destructive'
                        : 'secondary'
                  }
                  className={
                    checkin.current_status === QueueStatus.DISETUJUI
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : checkin.current_status === QueueStatus.DITOLAK
                        ? 'bg-rose-500 hover:bg-rose-600'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }
                >
                  {checkin.current_status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {status === QueueStatus.MENUNGGU ? (
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
                ) : (
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
