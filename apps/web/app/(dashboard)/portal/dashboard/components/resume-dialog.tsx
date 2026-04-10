'use client';

import { useState } from 'react';
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
import { useResumeCheckIn } from '@/hooks/api/use-check-in';
import { toast } from 'sonner';

interface ResumeDialogProps {
  queueNumber: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ResumeDialog({
  queueNumber,
  trigger,
  onSuccess,
}: ResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const resumeMutation = useResumeCheckIn();

  const handleResume = () => {
    resumeMutation.mutate(queueNumber, {
      onSuccess: () => {
        toast.success('Antrean Dilanjutkan', {
          description: `Antrean ${queueNumber} berhasil dilanjutkan dan Siap Check-Out.`,
        });
        setOpen(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error('Gagal', {
          description: error.message || 'Terjadi kesalahan.',
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lanjutkan Antrean?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan mengembalikan status antrean {queueNumber} menjadi
            Siap Check-Out. Pastikan semua kendala sudah diatasi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleResume();
            }}
            disabled={resumeMutation.isPending}
          >
            {resumeMutation.isPending ? 'Memproses...' : 'Lanjutkan'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
