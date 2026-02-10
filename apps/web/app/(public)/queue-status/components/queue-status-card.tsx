'use client';

import { Building2, User, Clock, Hourglass, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface FormattedQueueStatus {
  queueNumber: string;
  status: string;
  statusDisplayText: string;
  updatedAt: string;
  companyName?: string;
  driverName?: string;
  submissionTime?: string;
  estimatedWaitTime?: string;
}

interface QueueStatusCardProps {
  data: FormattedQueueStatus;
  onRefresh: () => void;
}

export function QueueStatusCard({ data, onRefresh }: QueueStatusCardProps) {
  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-status-success-fg bg-status-success-bg border-status-success-border';
      case 'REJECTED':
        return 'text-status-error-fg bg-status-error-bg border-status-error-border';
      case 'WAITING':
        // Keeping hardcoded yellow/warning for now as defined in requirements (Red/Green/Blue refined)
        // Ideally should be status-warning
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default:
        // Info/Blue
        return 'text-status-info-fg bg-status-info-bg border-status-info-border';
    }
  };

  return (
    <Card
      className={`relative overflow-hidden border-2 shadow-2xl backdrop-blur-xl ${getStatusColor(data.status).replace('text-', 'border-').split(' ')[2]} slide-in-from-bottom-8 animate-in fade-in duration-700`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-b opacity-5 ${getStatusColor(data.status).split(' ')[1]}`}
      />

      <CardHeader className="relative pb-8 text-center border-b border-border/50 bg-muted/20">
        <CardDescription className="mb-3 font-bold tracking-widest uppercase text-muted-foreground text-xxs">
          Status Antrean Anda
        </CardDescription>
        <CardTitle className="font-mono text-6xl font-black tracking-tighter text-foreground sm:text-7xl">
          {data.queueNumber}
        </CardTitle>
        <div className="flex justify-center pt-6">
          <div
            className={`inline-flex items-center px-5 py-2 rounded-full border ring-2 ring-offset-2 ring-offset-background text-sm font-bold shadow-sm transition-all ${getStatusColor(
              data.status,
            )}`}
          >
            <span className="relative flex w-3 h-3 mr-3">
              {(data.status === 'WAITING' || data.status === 'call_driver') && (
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-current" />
              )}
              <span className="relative inline-flex w-3 h-3 rounded-full bg-current" />
            </span>
            {data.statusDisplayText}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-8 px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="group relative p-4 overflow-hidden transition-all border rounded-2xl bg-background/50 hover:bg-background/80 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">
              <Building2 className="mr-2 w-4 h-4 text-primary" />
              Perusahaan
            </div>
            <div className="text-lg font-bold leading-tight text-foreground line-clamp-2">
              {data.companyName}
            </div>
          </div>

          <div className="group relative p-4 overflow-hidden transition-all border rounded-2xl bg-background/50 hover:bg-background/80 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">
              <User className="mr-2 w-4 h-4 text-primary" />
              Driver
            </div>
            <div className="text-lg font-bold leading-tight text-foreground line-clamp-1">
              {data.driverName}
            </div>
          </div>

          <div className="group relative p-4 overflow-hidden transition-all border rounded-2xl bg-background/50 hover:bg-background/80 hover:shadow-md hover:border-primary/20">
            <div className="flex items-center mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">
              <Clock className="mr-2 w-4 h-4 text-primary" />
              Waktu Submit
            </div>
            <div className="text-base font-semibold text-foreground">
              {data.submissionTime
                ? new Date(data.submissionTime).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })
                : '-'}
            </div>
          </div>

          {data.estimatedWaitTime && (
            <div className="group relative p-4 overflow-hidden transition-all border rounded-2xl bg-background/50 hover:bg-background/80 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center mb-2 text-xs font-bold tracking-wider uppercase text-muted-foreground">
                <Hourglass className="mr-2 w-4 h-4 text-primary" />
                Estimasi Tunggu
              </div>
              <div className="text-xl font-bold text-foreground">
                {data.estimatedWaitTime}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-border/50">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3 mr-2" />
              Update: {new Date(data.updatedAt).toLocaleTimeString('id-ID')}
            </div>

            <Button
              variant="outline"
              size="default"
              onClick={onRefresh}
              className="w-full font-semibold transition-all shadow-sm sm:w-auto hover:bg-primary hover:text-primary-foreground group"
            >
              <RefreshCw className="mr-2 w-4 h-4 transition-transform group-hover:rotate-180" />
              Refresh Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
