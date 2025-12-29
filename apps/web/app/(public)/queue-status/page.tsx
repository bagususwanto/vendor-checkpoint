'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { type QueueSearch } from '@repo/types';
import { useQueueStatus } from '@/hooks/api/use-check-in';
import { QueueSearchForm } from './components/queue-search-form';
import { QueueStatusCard, FormattedQueueStatus } from './components/queue-status-card';
import { QueueStatusHeader } from './components/queue-status-header';

function QueueStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeQueueNumber, setActiveQueueNumber] = useState<string | null>(null);

  const { data: qStatus, isLoading, error, refetch } = useQueueStatus(activeQueueNumber);

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
    <div className="pt-20 space-y-6">
      <QueueStatusHeader />


      <div className="space-y-2 text-center">
        <h1 className="font-bold text-3xl tracking-tight">
          Cek Status Antrean
        </h1>
        <p className="text-muted-foreground">
          Masukkan nomor antrean Anda untuk melihat status terkini
        </p>
      </div>

      <QueueSearchForm
        initialQueueNumber={searchParams.get('queueNumber')}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {error && (
        <Card className="bg-red-500/5 slide-in-from-top-2 border-red-500/20 animate-in fade-in">
          <CardContent className="pt-6 font-medium text-red-600 text-center">
            {'Terjadi kesalahan saat mencari nomor antrean.'}
          </CardContent>
        </Card>
      )}

      {activeQueueNumber && !isLoading && !error && qStatus === null && (
        <Card className="bg-orange-500/5 slide-in-from-top-2 border-orange-500/20 animate-in fade-in">
          <CardContent className="pt-6 font-medium text-orange-600 text-center">
            {'Nomor antrean tidak ditemukan.'}
          </CardContent>
        </Card>
      )}

      {result && (
        <QueueStatusCard
          data={result}
          onRefresh={() => handleSearch({ queueNumber: activeQueueNumber! })}
        />
      )}
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
