'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useHoldCheckIn } from '@/hooks/api/use-check-in';
import { toast } from 'sonner';

interface HoldDialogProps {
  queueNumber: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function HoldDialog({
  queueNumber,
  trigger,
  onSuccess,
}: HoldDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const holdMutation = useHoldCheckIn();

  const handleHold = () => {
    if (!reason.trim()) {
      toast.error('Alasan Diperlukan', {
        description: 'Mohon isi alasan untuk menahan check-in ini.',
      });
      return;
    }

    holdMutation.mutate(
      { queue_number: queueNumber, reason },
      {
        onSuccess: () => {
          toast.success('Berhasil ditahan', {
            description: `Antrean ${queueNumber} sementara ditahan.`,
          });
          setOpen(false);
          setReason('');
          onSuccess?.();
        },
        onError: (error) => {
          toast.error('Gagal', {
            description: error.message || 'Terjadi kesalahan.',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tahan Antrean (Hold)</DialogTitle>
          <DialogDescription>
            Masukkan alasan penahanan antrean ini. Antrean akan dipindahkan ke tab Tertahan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Alasan Penahanan</Label>
            <Textarea
              id="reason"
              placeholder="Tuliskan kendala atau alasan mengapa antrean ditahan..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleHold} disabled={holdMutation.isPending || !reason.trim()}>
            {holdMutation.isPending ? 'Menyimpan...' : 'Tahan Antrean'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
