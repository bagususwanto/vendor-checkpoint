'use client';

import { CheckCircle2, Clock, AlertTriangle, XCircle, BarChart3, RotateCw } from 'lucide-react';

export interface FidsStats {
  total: number;
  arrived: number;
  inProgress: number;
  completed: number;
  pending: number;
  overdue: number;
  missed: number;
}

interface FidsSummaryPanelProps {
  stats: FidsStats;
}

export function FidsSummaryPanel({ stats }: FidsSummaryPanelProps) {
  return (
    <div className="h-full rounded-3xl bg-card/60 backdrop-blur-xl border border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3 shrink-0 bg-muted/30">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground uppercase tracking-wide">
          Summary
        </h3>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* Total Box */}
        <div className="bg-muted/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-border shadow-sm">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Jadwal</span>
          <span className="text-4xl font-black text-foreground tabular-nums">{stats.total}</span>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {/* ARRIVED */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">ARRIVED</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{stats.arrived}</span>
          </div>
          
          {/* IN_PROGRESS */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <div className="flex items-center gap-3">
              <RotateCw className="w-5 h-5 text-teal-500" />
              <span className="font-semibold text-teal-700 dark:text-teal-400">IN PROGRESS</span>
            </div>
            <span className="text-2xl font-bold text-teal-700 dark:text-teal-400 tabular-nums">{stats.inProgress}</span>
          </div>

          {/* COMPLETED */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-400">COMPLETED</span>
            </div>
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-400 tabular-nums">{stats.completed}</span>
          </div>

          {/* PENDING */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-700 dark:text-blue-400">PENDING</span>
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">{stats.pending}</span>
          </div>

          {/* OVERDUE */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-orange-700 dark:text-orange-400">OVERDUE</span>
            </div>
            <span className="text-2xl font-bold text-orange-700 dark:text-orange-400 tabular-nums">{stats.overdue}</span>
          </div>

          {/* MISSED */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-700 dark:text-red-400">MISSED</span>
            </div>
            <span className="text-2xl font-bold text-red-700 dark:text-red-400 tabular-nums">{stats.missed}</span>
          </div>
        </div>
      </div>

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
