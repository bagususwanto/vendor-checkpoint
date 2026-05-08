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
        toast.success('Queue Resumed', {
          description: `Queue ${queueNumber} successfully resumed and is Ready for Check-Out.`,
        });
        setOpen(false);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error('Failed', {
          description: error.message || 'An error occurred.',
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resume Queue?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will return queue {queueNumber} to Ready for Check-Out
            status. Ensure all issues are resolved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleResume();
            }}
            disabled={resumeMutation.isPending}
          >
            {resumeMutation.isPending ? 'Processing...' : 'Resume'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
