'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useChecklistStore } from '@/stores/use-checklist.store';

interface CheckInExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInExitDialog({ open, onOpenChange }: CheckInExitDialogProps) {
  const router = useRouter();
  const { clearChecklistData } = useChecklistStore();

  const handleConfirmExit = () => {
    clearChecklistData();
    onOpenChange(false);
    router.push('/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Navigasi</DialogTitle>
          <DialogDescription>
            Apakah yakin kembali ke home, data input akan terhapus?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirmExit}>
            Ya, Kembali ke Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
