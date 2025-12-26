'use client';

import { User, Building2, Sparkles } from 'lucide-react';

export interface QueueItem {
  queueNumber: string;
  status: string;
  driverName: string;
  companyName: string;
}

interface DisplayCurrentQueueProps {
  currentQueue: QueueItem | null;
}

export function DisplayCurrentQueue({
  currentQueue,
}: DisplayCurrentQueueProps) {
  if (!currentQueue) {
    return (
      <div className="flex flex-col justify-center items-center bg-card/60 backdrop-blur-xl p-8 border border-border rounded-3xl h-full">
        <div className="flex justify-center items-center bg-muted mb-6 rounded-full w-24 h-24">
          <Sparkles className="w-12 h-12 text-muted-foreground" />
        </div>
        <p className="font-bold text-muted-foreground text-2xl">
          Tidak ada antrean dipanggil
        </p>
        <p className="mt-2 text-muted-foreground/60 text-lg">
          Menunggu antrean berikutnya...
        </p>
      </div>
    );
  }

  return (
    <div className="relative grid grid-rows-[auto_1fr_auto] bg-card/60 backdrop-blur-xl border border-border rounded-3xl h-full overflow-hidden">
      {/* Animated Top Border */}
      <div className="top-0 absolute inset-x-0 bg-linear-to-r from-primary via-emerald-500 to-primary h-1 bg-size-[200%_100%] animate-[shimmer_2s_linear_infinite]" />

      {/* Status Badge */}
      <div className="px-4 pt-5 pb-3 text-center">
        <div className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500/20 to-primary/20 px-4 py-1.5 border border-emerald-500/30 rounded-full">
          <span className="bg-emerald-500 rounded-full w-2.5 h-2.5 animate-pulse" />
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base uppercase tracking-widest">
            Sedang Diproses
          </span>
        </div>
      </div>

      {/* Queue Number - Main Focus */}
      <div className="flex flex-col justify-center items-center px-4 overflow-hidden">
        <p className="mb-2 font-medium text-muted-foreground text-base uppercase tracking-widest">
          Nomor Antrean
        </p>
        {/* Split queue number for better display */}
        {(() => {
          const parts = currentQueue.queueNumber.split('-');
          const datePart = parts.slice(0, -1).join('-');
          const numberPart = parts[parts.length - 1];
          return (
            <div className="text-center">
              <span className="block font-mono font-bold text-muted-foreground text-xl tracking-wider">
                {datePart}
              </span>
              <span className="block font-mono font-black text-[clamp(4rem,10vw,7rem)] text-foreground leading-none tracking-tight">
                {numberPart}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Info Section */}
      <div className="space-y-3 bg-muted/30 p-4">
        {/* Company */}
        <div className="bg-background/50 p-3 border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="font-semibold text-xs uppercase tracking-wider">
              Perusahaan
            </span>
          </div>
          <p className="font-bold text-foreground text-lg line-clamp-2 leading-snug">
            {currentQueue.companyName}
          </p>
        </div>

        {/* Driver */}
        <div className="bg-background/50 p-3 border border-border rounded-xl">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-semibold text-xs uppercase tracking-wider">
              Driver
            </span>
          </div>
          <p className="font-bold text-foreground text-base line-clamp-1 leading-snug">
            {currentQueue.driverName}
          </p>
        </div>
      </div>

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
