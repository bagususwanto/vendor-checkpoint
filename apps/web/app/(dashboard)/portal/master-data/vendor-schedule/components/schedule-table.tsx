'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Loader2, Trash2 } from 'lucide-react';
import { useVendorSchedules, useDeleteVendorSchedule } from '@/hooks/api/use-vendor-schedule';
import { VendorScheduleResponse } from '@repo/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ScheduleTableProps {
  onEdit: (schedule: VendorScheduleResponse) => void;
}

const DAYS: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
  7: 'Minggu',
};

export function ScheduleTable({ onEdit }: ScheduleTableProps) {
  const { data: schedules, isLoading } = useVendorSchedules({});
  const deleteMutation = useDeleteVendorSchedule();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Jadwal berhasil dihapus');
      },
      onError: (error) => {
        toast.error('Gagal menghapus jadwal', {
          description: error.message || 'Terjadi kesalahan sistem',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-md">
        Belum ada data jadwal vendor.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center">No</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Hari</TableHead>
            <TableHead>Waktu Kedatangan</TableHead>
            <TableHead>Waktu Keberangkatan</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule: VendorScheduleResponse, index: number) => (
            <TableRow key={schedule.schedule_id}>
              <TableCell className="text-center font-medium">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold">{schedule.vendor?.company_name || 'Tanpa Nama'}</span>
                  <span className="text-xs text-muted-foreground">{schedule.vendor?.vendor_code}</span>
                </div>
              </TableCell>
              <TableCell>{DAYS[schedule.day_of_week] || schedule.day_of_week}</TableCell>
              <TableCell>{schedule.arrival_time}</TableCell>
              <TableCell>{schedule.departure_time}</TableCell>
              <TableCell className="text-center">
                <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                  {schedule.is_active ? 'Aktif' : 'Non-Aktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(schedule)}
                    title="Edit Jadwal"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Hapus Jadwal"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Jadwal Vendor</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus jadwal untuk vendor &quot;
                          <span className="font-semibold text-foreground">
                            {schedule.vendor?.company_name || schedule.vendor?.vendor_code}
                          </span>
                          &quot; pada hari {DAYS[schedule.day_of_week]}? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(schedule.schedule_id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
