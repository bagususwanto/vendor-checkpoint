import { Badge } from '@/components/ui/badge';
import { QueueStatus } from '@repo/types';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={
        status === QueueStatus.APPROVED
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
          : status === QueueStatus.REJECTED
            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
            : status === QueueStatus.COMPLETED
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
              : status === QueueStatus.ON_HOLD
                ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
      }
    >
      {status}
    </Badge>
  );
}
