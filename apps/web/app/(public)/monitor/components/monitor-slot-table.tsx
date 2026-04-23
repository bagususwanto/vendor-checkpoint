'use client';

import { Users, ArrowRight, Clock, AlertTriangle, CheckCircle2, Timer, XCircle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type ArrivalDisplayStatus =
  | 'PENDING'
  | 'OVERDUE'
  | 'ON_TIME'
  | 'LATE'
  | 'EARLY'
  | 'MISSED';

export interface ParsedMonitorSlot {
  id: string;
  expectedTime: string;
  companyName: string;
  vendorCode: string;
  rit: number;
  truckStation: string | null;
  status: ArrivalDisplayStatus;
  arrivalTime: string | null;
}

interface MonitorSlotTableProps {
  slots: ParsedMonitorSlot[];
}

export function MonitorSlotTable({ slots }: MonitorSlotTableProps) {
  const getStatusBadge = (status: ArrivalDisplayStatus) => {
    const baseClass =
      'px-3 py-1 font-black text-[10px] tracking-widest transition-all duration-300 shadow-xs uppercase';

    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className={cn(baseClass, 'bg-muted text-muted-foreground border-border gap-1.5')}
          >
            <Clock className="w-3 h-3" /> Menunggu
          </Badge>
        );
      case 'OVERDUE':
        return (
          <Badge
            variant="outline"
            className={cn(baseClass, 'bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse gap-1.5')}
          >
            <AlertTriangle className="w-3 h-3" /> Belum Tiba
          </Badge>
        );
      case 'ON_TIME':
        return (
          <Badge
            variant="outline"
            className={cn(baseClass, 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1.5')}
          >
            <CheckCircle2 className="w-3 h-3" /> Tepat Waktu
          </Badge>
        );
      case 'LATE':
        return (
          <Badge
            variant="outline"
            className={cn(baseClass, 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse gap-1.5')}
          >
            <Timer className="w-3 h-3" /> Terlambat
          </Badge>
        );
      case 'EARLY':
        return (
          <Badge
            variant="outline"
            className={cn(baseClass, 'bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5')}
          >
            <Zap className="w-3 h-3" /> Lebih Awal
          </Badge>
        );
      case 'MISSED':
        return (
          <Badge
            variant="outline"
            className={cn(baseClass, 'bg-slate-500/10 text-slate-500 border-slate-500/20 gap-1.5')}
          >
            <XCircle className="w-3 h-3" /> Missed
          </Badge>
        );
    }
  };

  return (
    <Card className="h-full border-border flex flex-col overflow-hidden shadow-sm py-0">
      <Table className="border-collapse table-fixed">
        <TableHeader className="bg-muted/30 sticky top-0 z-20">
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="w-[12%] px-8 h-14 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Scheduled
            </TableHead>
            <TableHead className="w-[35%] px-8 h-14 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Vendor Name
            </TableHead>
            <TableHead className="w-[8%] px-4 h-14 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">
              Rit
            </TableHead>
            <TableHead className="w-[15%] px-4 h-14 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">
              Station
            </TableHead>
            <TableHead className="w-[12%] px-8 h-14 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              Tiba
            </TableHead>
            <TableHead className="w-[18%] px-8 h-14 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar-hidden relative">
        <Table className="border-collapse table-fixed">
          <TableBody className="[&_tr:last-child]:border-b">
            {slots.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={4} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground/30 py-20">
                    <Users className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-xl font-black uppercase tracking-tighter">
                      No Active Schedules
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              slots.map((slot) => {
                const isActive = slot.status === 'ON_TIME' || slot.status === 'EARLY';
                const isLate = slot.status === 'LATE';
                const isMissed = slot.status === 'MISSED';

                return (
                  <TableRow
                    key={slot.id}
                    className={cn(
                      'transition-all duration-300 relative group h-16 border-border',
                      isActive && 'bg-emerald',
                      isLate && 'bg-red-500/5',
                      isMissed && 'opacity-50 grayscale-[0.2]',
                    )}
                  >
                    {/* Arrival Status Indicator */}
                    <TableCell className="w-[12%] px-6 py-0">
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-emerald-500 rounded-r-full shadow-[2px_0_8px_rgba(16,185,129,0.3)]" />
                      )}
                      {isLate && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-red-500 rounded-r-full shadow-[2px_0_8px_rgba(239,68,68,0.3)]" />
                      )}
                      <div
                        className={cn(
                          'text-2xl font-mono font-black tabular-nums tracking-tighter',
                          isActive ? 'text-emerald-600 dark:text-emerald-400' : '',
                          isLate ? 'text-red-500' : '',
                          !isActive && !isLate ? 'text-foreground' : '',
                        )}
                      >
                        {slot.expectedTime}
                      </div>
                    </TableCell>

                    <TableCell className="w-[35%] px-6 py-0">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'text-lg font-black tracking-tight leading-tight truncate transition-colors',
                            isMissed
                              ? 'text-red-500'
                              : 'text-foreground group-hover:text-primary',
                          )}
                        >
                          {slot.companyName}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                          ID: {slot.vendorCode}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="w-[8%] px-4 py-0 text-center">
                      <div className="text-xl font-mono font-black text-foreground">
                        {slot.rit}
                      </div>
                    </TableCell>

                    <TableCell className="w-[15%] px-4 py-0 text-center">
                      <div className="text-sm font-bold uppercase text-muted-foreground bg-muted/50 px-2 py-1 rounded-sm border border-border inline-block">
                        {slot.truckStation || '-'}
                      </div>
                    </TableCell>

                    <TableCell className="w-[12%] px-6 py-0">
                      {slot.arrivalTime ? (
                        <div className="flex items-center gap-1.5 text-primary font-mono font-black text-lg tracking-tighter tabular-nums">
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                          {slot.arrivalTime}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30 font-mono font-black text-lg tracking-tighter">
                          --:--
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="w-[18%] px-6 py-0 text-right">
                      {getStatusBadge(slot.status)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <style jsx>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </Card>
  );
}
