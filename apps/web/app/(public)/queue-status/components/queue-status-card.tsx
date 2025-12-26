'use client';

import {
  Building2,
  User,
  Clock,
  Hourglass,
  RefreshCw,
} from 'lucide-react';
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
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'REJECTED':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'WAITING':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <Card className="bg-card/60 slide-in-from-top-4 border-primary/20 overflow-hidden animate-in fade-in">
      <div className="top-0 absolute inset-x-0 bg-linear-to-r from-transparent via-primary/50 to-transparent h-1" />

      <CardHeader className="bg-muted/20 pb-6 border-border/40 border-b text-center">
        <CardDescription className="mb-2 font-semibold text-primary text-xs uppercase tracking-wider">
          Status Antrean Anda
        </CardDescription>
        <CardTitle className="font-mono font-bold text-foreground text-4xl sm:text-5xl tracking-tighter">
          {data.queueNumber}
        </CardTitle>
        <div className="flex justify-center pt-4">
          <div
            className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-semibold shadow-sm ${getStatusColor(
              data.status
            )}`}
          >
            {data.statusDisplayText}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
            <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
              <Building2 className="mr-2 w-3.5 h-3.5" />
              Perusahaan
            </div>
            <div className="font-medium text-foreground text-lg wrap-break-word leading-snug">
              {data.companyName}
            </div>
          </div>

          <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
            <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
              <User className="mr-2 w-3.5 h-3.5" />
              Driver
            </div>
            <div className="font-medium text-foreground text-lg wrap-break-word leading-snug">
              {data.driverName}
            </div>
          </div>

          <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
            <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
              <Clock className="mr-2 w-3.5 h-3.5" />
              Waktu Submit
            </div>
            <div className="font-medium text-foreground text-base">
              {data.submissionTime
                ? new Date(data.submissionTime).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })
                : '-'}
            </div>
          </div>

          {data.estimatedWaitTime && (
            <div className="space-y-1 bg-muted/30 p-4 rounded-xl">
              <div className="flex items-center font-medium text-muted-foreground text-xs uppercase tracking-wide">
                <Hourglass className="mr-2 w-3.5 h-3.5" />
                Estimasi Tunggu
              </div>
              <div className="font-medium text-foreground text-base">
                {data.estimatedWaitTime}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 pt-6 border-border/40 border-t">
          <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
            <div className="text-muted-foreground text-xs italic">
              *Terakhir diperbarui:{' '}
              {new Date(data.updatedAt).toLocaleTimeString('id-ID')}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="mr-2 w-3.5 h-3.5" />
              Refresh Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
