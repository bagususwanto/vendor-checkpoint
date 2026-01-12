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
import { VerificationSheet } from '../../dashboard/components/verification-sheet';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { QueueStatus } from '@repo/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QueueTableProps {
  checkins: any[]; // Replace any with proper type
  isLoading: boolean;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export function QueueTable({
  checkins,
  isLoading,
  page,
  totalPages,
  setPage,
}: QueueTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Verifikasi</CardTitle>
        <CardDescription>Kelola verifikasi check-in driver.</CardDescription>
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
                    <Badge
                      variant={
                        checkin.current_status === QueueStatus.DISETUJUI ||
                        checkin.current_status === 'APPROVED'
                          ? 'default'
                          : checkin.current_status === QueueStatus.DITOLAK ||
                              checkin.current_status === 'REJECTED'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className={
                        checkin.current_status === QueueStatus.DISETUJUI ||
                        checkin.current_status === 'APPROVED'
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : checkin.current_status === QueueStatus.DITOLAK ||
                              checkin.current_status === 'REJECTED'
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
                        status: checkin.current_status.toLowerCase(),
                      }}
                      trigger={<Button size="sm">Verifikasi</Button>}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
