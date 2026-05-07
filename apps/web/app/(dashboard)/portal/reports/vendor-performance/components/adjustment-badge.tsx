import * as React from 'react';
import { PencilLine } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PerformanceAdjustment } from '@repo/types';

interface AdjustmentBadgeProps {
  adjustment: PerformanceAdjustment | null;
}

export function AdjustmentBadge({ adjustment }: AdjustmentBadgeProps) {
  if (!adjustment) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-blue-100 text-blue-600 cursor-help ml-1">
            <PencilLine className="h-3 w-3" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] text-xs">
          <p className="font-bold mb-1">Data telah disesuaikan</p>
          <p className="text-muted-foreground italic mb-1">"{adjustment.adjustment_reason}"</p>
          <p className="text-[10px] text-right text-muted-foreground border-t pt-1">
            Oleh: {adjustment.adjusted_by_user?.full_name}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
