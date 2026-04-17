'use client';

import { CheckCircle2, Clock, AlertTriangle, XCircle, BarChart3, RotateCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const CardItem = ({ label, value, icon: Icon, colorClass, textClass }: any) => (
    <div className={`relative flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 transition-all duration-300 hover:scale-[1.02] shadow-xs group overflow-hidden`}>
      <div className="absolute top-0 right-0 p-2 opacity-5 transform group-hover:scale-110 transition-transform">
        <Icon size={40} />
      </div>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none block mb-1">
            {label}
          </span>
          <span className={`text-2xl font-black tabular-nums leading-none ${textClass}`}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full border-border flex flex-col overflow-hidden shadow-sm py-0">
      <CardHeader className="px-5 py-4 border-b border-border bg-muted/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight">
            Live <span className="text-primary">Summary</span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-5 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar-hidden">
        <CardItem 
          label="Total Schedule" 
          value={stats.total} 
          icon={BarChart3} 
          colorClass="bg-primary text-primary-foreground" 
          textClass="text-primary"
        />
        
        <Separator className="my-1" />

        <div className="grid grid-cols-1 gap-3">
          <CardItem 
            label="Arrived" 
            value={stats.arrived} 
            icon={CheckCircle2} 
            colorClass="bg-emerald-500 text-white" 
            textClass="text-emerald-500"
          />
          
          <CardItem 
            label="In Progress" 
            value={stats.inProgress} 
            icon={RotateCw} 
            colorClass="bg-teal-500 text-white" 
            textClass="text-teal-500"
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

          <CardItem 
            label="Missed" 
            value={stats.missed} 
            icon={XCircle} 
            colorClass="bg-red-500 text-white" 
            textClass="text-red-500"
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
