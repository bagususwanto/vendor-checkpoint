'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QrCode, ShieldAlert, SearchX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { type QueueSearch } from '@repo/types';
import { useQueueStatus } from '@/hooks/api/use-check-in';
import { QueueSearchForm } from './components/queue-search-form';
import {
  QueueStatusCard,
  FormattedQueueStatus,
} from './components/queue-status-card';
import { QueueStatusHeader } from './components/queue-status-header';

function QueueStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeQueueNumber, setActiveQueueNumber] = useState<string | null>(
    null,
  );

  const {
    data: qStatus,
    isLoading,
    error,
    refetch,
  } = useQueueStatus(activeQueueNumber);

  useEffect(() => {
    const queueParam = searchParams.get('queueNumber');
    if (queueParam) {
      setActiveQueueNumber(queueParam);
    }
  }, [searchParams]);

  function handleSearch(data: QueueSearch) {
    if (data.queueNumber !== activeQueueNumber) {
      setActiveQueueNumber(data.queueNumber);
    } else {
      refetch();
    }
  }

  const result: FormattedQueueStatus | null = useMemo(() => {
    if (!qStatus) return null;
    const opsStatus = qStatus.ops_queue_status || {};
    return {
      queueNumber: qStatus.queue_number,
      status: opsStatus.status || 'WAITING',
      statusDisplayText: opsStatus.status_display_text || 'Menunggu',
      updatedAt: new Date().toISOString(),
      companyName: qStatus.snapshot_company_name || qStatus.company_name,
      driverName: qStatus.driver_name,
      submissionTime: qStatus.submission_time,
      estimatedWaitTime: opsStatus.estimated_wait_minutes
        ? `${opsStatus.estimated_wait_minutes} Menit`
        : undefined,
    };
  }, [qStatus]);

  return (
    <div className="relative flex flex-col items-center bg-transparent min-h-screen overflow-hidden selection:bg-primary/20">
      <QueueStatusHeader />

      <main className="relative z-10 flex flex-col flex-1 gap-8 px-4 py-24 w-full max-w-lg container">
        <div className="space-y-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 mb-2 rounded-2xl bg-primary/10 ring-1 ring-primary/20 backdrop-blur-xl">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="bg-clip-text bg-linear-to-b from-foreground to-muted-foreground font-bold text-4xl text-transparent tracking-tight sm:text-5xl">
            Cek Status Antrean
          </h1>
          <p className="mx-auto max-w-[85%] text-lg text-muted-foreground leading-relaxed">
            Pantau posisi antrean dan estimasi waktu tunggu Anda secara
            real-time.
          </p>
        </div>

        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <QueueSearchForm
            initialQueueNumber={searchParams.get('queueNumber')}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />

          <div className="relative min-h-[100px]">
            {error && (
              <Card className="border-destructive/20 bg-destructive/5 shadow-lg shadow-destructive/10 animate-in fade-in zoom-in-95 duration-300">
                <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-destructive">
                      Terjadi Kesalahan
                    </p>
                    <p className="text-sm text-destructive/80">
                      Gagal mencari data antrean. Silakan coba lagi.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeQueueNumber && !isLoading && !error && qStatus === null && (
              <Card className="border-orange-500/20 bg-orange-500/5 shadow-lg shadow-orange-500/10 animate-in fade-in zoom-in-95 duration-300">
                <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="p-3 rounded-full bg-orange-500/10 text-orange-600">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-orange-600">
                      Antrean Tidak Ditemukan
                    </p>
                    <p className="text-sm text-orange-600/80">
                      Nomor antrean{' '}
                      <span className="font-mono font-bold">
                        {activeQueueNumber}
                      </span>{' '}
                      tidak terdaftar.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <QueueStatusCard
                data={result}
                onRefresh={() =>
                  handleSearch({ queueNumber: activeQueueNumber! })
                }
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QueueStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueueStatusContent />
    </Suspense>
  );
}
