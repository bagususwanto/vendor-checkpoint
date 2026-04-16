'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Edit2, Loader2, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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

const PAGE_SIZE = 10;

export function ScheduleTable({ onEdit }: ScheduleTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: result, isLoading } = useVendorSchedules({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });
  const deleteMutation = useDeleteVendorSchedule();

  const schedules = result?.data ?? [];
  const meta = result?.meta;

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari vendor..."
            className="pl-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" size="sm">Cari</Button>
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
          >
            Reset
          </Button>
        )}
      </form>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          {search ? `Tidak ada hasil untuk "${search}".` : 'Belum ada data jadwal vendor.'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead>Waktu Tiba</TableHead>
                <TableHead>Waktu Pulang</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule: VendorScheduleResponse, index: number) => (
                <TableRow key={schedule.schedule_id}>
                  <TableCell className="text-center font-medium">
                    {(page - 1) * PAGE_SIZE + index + 1}
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
      )}

      {/* Pagination footer */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            Menampilkan {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, meta.total)} dari {meta.total} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Hal {page} / {meta.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
              disabled={page >= meta.total_pages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
