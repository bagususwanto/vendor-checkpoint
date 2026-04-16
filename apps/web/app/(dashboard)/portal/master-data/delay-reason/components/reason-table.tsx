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
import { useDelayReasons, useDeleteDelayReason } from '@/hooks/api/use-delay-reasons';
import { DelayReasonResponse } from '@repo/types';
import { formatDateTime } from '@/lib/utils';
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

interface ReasonTableProps {
  category: 'Arrival' | 'Departure';
  onEdit: (reason: DelayReasonResponse) => void;
}

const PAGE_SIZE = 10;

export function ReasonTable({ category, onEdit }: ReasonTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data: result, isLoading } = useDelayReasons({
    category,
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });
  const deleteMutation = useDeleteDelayReason();

  const reasons = result?.data ?? [];
  const meta = result?.meta;

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Alasan berhasil dihapus');
      },
      onError: (error) => {
        toast.error('Gagal menghapus alasan', {
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
            placeholder="Cari teks alasan..."
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
      ) : reasons.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          {search
            ? `Tidak ada hasil untuk "${search}".`
            : 'Belum ada data alasan keterlambatan untuk kategori ini.'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead>Teks Alasan</TableHead>
                <TableHead>Terakhir Diubah</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reasons.map((reason: DelayReasonResponse, index: number) => (
                <TableRow key={reason.delay_reason_id}>
                  <TableCell className="text-center font-medium">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell>{reason.reason_text}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(reason.updated_at as string)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={reason.is_active ? 'default' : 'secondary'}>
                      {reason.is_active ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(reason)}
                        title="Edit Alasan"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Hapus Alasan"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Alasan Delay</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus alasan &quot;
                              <span className="font-semibold text-foreground">
                                {reason.reason_text}
                              </span>
                              &quot;? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(reason.delay_reason_id)}
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
