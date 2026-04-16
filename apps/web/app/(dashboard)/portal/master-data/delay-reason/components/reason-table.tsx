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

export function ReasonTable({ category, onEdit }: ReasonTableProps) {
  const { data: reasons, isLoading } = useDelayReasons({ category });
  const deleteMutation = useDeleteDelayReason();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!reasons || reasons.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-md">
        Belum ada data alasan keterlambatan untuk kategori ini.
      </div>
    );
  }

  return (
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
                {index + 1}
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
  );
}
