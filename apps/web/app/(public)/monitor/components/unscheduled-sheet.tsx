'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import { QueueStatus } from '@repo/types';

interface UnscheduledSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
}

export function UnscheduledSheet({
  open,
  onOpenChange,
  data,
}: UnscheduledSheetProps) {
  const getStatusBadge = (status: string) => {
    const baseClass =
      'px-2 py-0.5 text-[9px] font-black uppercase tracking-widest';

    switch (status) {
      case QueueStatus.WAITING:
        return (
          <Badge
            variant="outline"
            className={cn(
              baseClass,
              'bg-orange-500/10 text-orange-500 border-orange-500/20',
            )}
          >
            Waiting
          </Badge>
        );
      case QueueStatus.APPROVED:
        return (
          <Badge
            variant="outline"
            className={cn(
              baseClass,
              'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            )}
          >
            Approved
          </Badge>
        );
      case QueueStatus.ACTIVE:
        return (
          <Badge
            variant="outline"
            className={cn(
              baseClass,
              'bg-blue-500/10 text-blue-600 border-blue-500/20',
            )}
          >
            Active
          </Badge>
        );
      case QueueStatus.COMPLETED:
        return (
          <Badge
            variant="outline"
            className={cn(
              baseClass,
              'bg-muted text-muted-foreground border-border',
            )}
          >
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className={baseClass}>
            {status}
          </Badge>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-l border-border bg-background/95 backdrop-blur-md">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Vendor Tidak Terjadwal
          </SheetTitle>
        </SheetHeader>

        <div className="relative h-full overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
                <Users className="w-12 h-12 mb-2 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest">
                  Tidak Ada Vendor Tidak Terjadwal
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Perusahaan
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                      Tiba
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow
                      key={item.entry_id}
                      className="border-border/50 group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm leading-none group-hover:text-primary transition-colors">
                            {item.snapshot_company_name}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-mono mt-1">
                            {item.queue_number}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-0.5 font-mono">
                          <div className="flex items-center gap-1 text-xs font-bold text-primary">
                            <Clock className="w-3 h-3 opacity-40" />
                            {formatDateTime(item.submission_time, 'HH:mm')}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                            {formatDateTime(item.submission_time, 'dd MMM yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {getStatusBadge(item.current_status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
