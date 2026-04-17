'use client';

import { Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type DisplayStatus = 'PENDING' | 'OVERDUE' | 'ARRIVED' | 'MISSED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ParsedFidsSlot {
  id: string;
  expectedTime: string;
  companyName: string;
  vendorCode: string;
  status: DisplayStatus;
  arrivalTime: string | null;
}

interface FidsSlotTableProps {
  slots: ParsedFidsSlot[];
}

export function FidsSlotTable({ slots }: FidsSlotTableProps) {
  const getStatusBadge = (status: DisplayStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">
            <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
            PENDING
          </Badge>
        );
      case 'OVERDUE':
        return (
          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
            OVERDUE
          </Badge>
        );
      case 'ARRIVED':
        return (
          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            ARRIVED
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30 font-bold">
            <span className="w-2 h-2 rounded-full bg-teal-500 mr-2 animate-pulse" />
            IN PROGRESS
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="outline" className="bg-slate-500/20 text-slate-400 border-slate-500/30">
            <span className="w-2 h-2 rounded-full bg-current mr-2" />
            COMPLETED
          </Badge>
        );
      case 'MISSED':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 opacity-80">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            MISSED
          </Badge>
        );
    }
  };

  return (
    <div className="h-full rounded-3xl bg-card/60 backdrop-blur-xl border border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground uppercase tracking-wide">
            Jadwal Kedatangan Hari Ini
          </h3>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border shrink-0">
        <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Waktu
        </div>
        <div className="col-span-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Vendor
        </div>
        <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Tiba
        </div>
        <div className="col-span-3 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
          Status
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative">
        {slots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
            <Users className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-xl font-medium">Tidak ada jadwal hari ini</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {slots.map((slot) => {
              const isActive = slot.status === 'ARRIVED' || slot.status === 'IN_PROGRESS';
              const isMissed = slot.status === 'MISSED';
              const isOverdue = slot.status === 'OVERDUE';
              
              let rowClass = "grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-muted/30";
              if (isActive) {
                rowClass += " bg-emerald-500/5 hover:bg-emerald-500/10 border-l-4 border-l-emerald-500";
              } else if (isMissed) {
                rowClass += " opacity-60 bg-red-500/5 blur-[0.2px]";
              } else if (isOverdue) {
                rowClass += " bg-orange-500/5";
              }

              return (
                <div key={slot.id} className={rowClass}>
                  {/* Expected Time */}
                  <div className="col-span-2">
                    <span className="font-mono font-bold text-xl text-foreground">
                      {slot.expectedTime}
                    </span>
                  </div>

                  {/* Company Name */}
                  <div className="col-span-5">
                    <p className={`font-bold text-lg truncate ${isMissed ? 'text-red-400' : 'text-foreground'}`} title={slot.companyName}>
                      {slot.companyName}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono truncate">
                      {slot.vendorCode}
                    </p>
                  </div>

                  {/* Arrival Time */}
                  <div className="col-span-2">
                    <span className="font-mono font-medium text-lg text-muted-foreground">
                      {slot.arrivalTime || '-'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 text-right flex justify-end">
                    {getStatusBadge(slot.status)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto-scroll container can be implemented in a wrapper or with pure CSS, but for now we rely on standard scroll */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
