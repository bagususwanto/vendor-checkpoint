'use client';

import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  BarChart3,
  Timer,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface MonitorStats {
  total: number;
  onTime: number;
  late: number;
  early: number;
  pending: number;
  overdue: number;
}

interface MonitorSummaryPanelProps {
  stats: MonitorStats;
}

export function MonitorSummaryPanel({ stats }: MonitorSummaryPanelProps) {
  const CardItem = ({
    label,
    value,
    icon: Icon,
    colorClass,
    textClass,
  }: any) => (
    <div
      className={`relative flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 transition-all duration-300 hover:scale-[1.02] shadow-xs group overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-2 opacity-5 transform group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <div className="flex items-center gap-2.5">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div>
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none block mb-1">
            {label}
          </span>
          <span
            className={`text-xl font-black tabular-nums leading-none ${textClass}`}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full border-border flex flex-col overflow-hidden shadow-sm py-0">
      <CardHeader className="px-5 py-3 border-b border-border bg-muted/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10">
            <BarChart3 className="w-4.5 h-4.5 text-primary" />
          </div>
          <CardTitle className="text-lg font-black text-foreground uppercase tracking-tight">
            Live <span className="text-primary">Summary</span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar-hidden">
        <CardItem
          label="Total Scheduled"
          value={stats.total}
          icon={BarChart3}
          colorClass="bg-primary text-primary-foreground"
          textClass="text-primary"
        />

        <Separator className="my-1" />

        <div className="grid grid-cols-1 gap-3">
          <CardItem
            label="On Time"
            value={stats.onTime}
            icon={CheckCircle2}
            colorClass="bg-emerald-500 text-white"
            textClass="text-emerald-500"
          />

          <CardItem
            label="Late"
            value={stats.late}
            icon={Timer}
            colorClass="bg-red-500 text-white"
            textClass="text-red-500"
          />

          <CardItem
            label="Early"
            value={stats.early}
            icon={Zap}
            colorClass="bg-blue-500 text-white"
            textClass="text-blue-500"
          />

          <CardItem
            label="Pending"
            value={stats.pending}
            icon={Clock}
            colorClass="bg-slate-400 text-white"
            textClass="text-slate-500 dark:text-slate-400"
          />

          <CardItem
            label="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            colorClass="bg-orange-500 text-white"
            textClass="text-orange-500"
          />
        </div>
      </CardContent>

      <style jsx>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          width: 0;
        }
      `}</style>
    </Card>
  );
}
