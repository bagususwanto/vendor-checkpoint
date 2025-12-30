'use client';

import { QueueItem } from './display-current-queue.js';
import { Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DisplayTableQueueProps {
  queues: QueueItem[];
  title?: string;
}

export function DisplayTableQueue({
  queues,
  title = 'Antrean Berikutnya',
}: DisplayTableQueueProps) {
  return (
    <div className="h-full rounded-3xl bg-card/60 backdrop-blur-xl border border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full border border-border">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-lg font-bold text-foreground">
            {queues.length}
          </span>
          <span className="text-muted-foreground text-sm">menunggu</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border shrink-0">
        <div className="col-span-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          #
        </div>
        <div className="col-span-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          No. Antrean
        </div>
        <div className="col-span-5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Perusahaan
        </div>
        <div className="col-span-2 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
          Status
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        {queues.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
            <Users className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-xl font-medium">Tidak ada antrean menunggu</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {queues.map((queue, index) => (
              <div
                key={queue.queueNumber}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-muted/50 ${
                  index === 0 ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                {/* Order Number */}
                <div className="col-span-1">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Queue Number */}
                <div className="col-span-4">
                  <span className="font-mono font-bold text-xl text-foreground">
                    {queue.queueNumber}
                  </span>
                </div>

                {/* Company Name */}
                <div className="col-span-5">
                  <p
                    className="font-medium text-lg text-foreground truncate"
                    title={queue.companyName}
                  >
                    {queue.companyName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {queue.driverName}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2 text-right">
                  <Badge
                    variant={
                      queue.status === 'MENUNGGU' ? 'outline' : 'secondary'
                    }
                    className={
                      queue.status === 'MENUNGGU'
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
                        : ''
                    }
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {queue.status === 'MENUNGGU' ? 'Menunggu' : queue.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
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
