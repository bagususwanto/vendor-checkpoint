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
      toast.error('Reason Required', {
        description: 'Please provide a reason to hold this check-in.',
      });
      return;
    }

    holdMutation.mutate(
      { queue_number: queueNumber, reason },
      {
        onSuccess: () => {
          toast.success('Successfully held', {
            description: `Queue ${queueNumber} is temporarily on hold.`,
          });
          setOpen(false);
          setReason('');
          onSuccess?.();
        },
        onError: (error) => {
          toast.error('Failed', {
            description: error.message || 'An error occurred.',
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
          <DialogTitle>Hold Queue</DialogTitle>
          <DialogDescription>
            Enter the reason for holding this queue. The queue will be moved to the On Hold tab.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Holding Reason</Label>
            <Textarea
              id="reason"
              placeholder="Write down the constraints or reasons why the queue is on hold..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleHold} disabled={holdMutation.isPending || !reason.trim()}>
            {holdMutation.isPending ? 'Saving...' : 'Hold Queue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
