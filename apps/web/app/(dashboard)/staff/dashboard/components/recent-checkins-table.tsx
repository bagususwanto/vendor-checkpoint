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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VerificationSheet } from './verification-sheet';
import { useVerificationList } from '@/hooks/api/use-check-in';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function RecentCheckinsTable() {
  const { data, isLoading } = useVerificationList(1, 5, undefined, {
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
  });

  const checkins = data?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in Terbaru</CardTitle>
        <CardDescription>Daftar 5 check-in terakhir hari ini.</CardDescription>
      </CardHeader>
      <CardContent>
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
                  Tidak ada data check-in terbaru
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
                        checkin.current_status === 'APPROVED' // Assuming APPROVED based on previous code logic, though API returns MENUNGGU
                          ? 'default'
                          : checkin.current_status === 'REJECTED'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className={
                        checkin.current_status === 'APPROVED'
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : checkin.current_status === 'REJECTED'
                            ? 'bg-rose-500 hover:bg-rose-600'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }
                    >
                      {checkin.current_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <VerificationSheet
                      checkin={{
                        id: checkin.queue_number,
                        company: checkin.snapshot_company_name,
                        driver: checkin.driver_name,
                        category: checkin.snapshot_category_name,
                        time: checkin.submission_time,
                        status: checkin.current_status.toLowerCase(), // mapping for compatibility if needed
                      }}
                      trigger={<Button size="sm">Verifikasi</Button>}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
