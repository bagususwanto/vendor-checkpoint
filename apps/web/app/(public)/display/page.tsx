'use client';

import { useActiveQueues } from '@/hooks/api/use-check-in';
import { useSystemConfigByKey } from '@/hooks/api/use-system-config';

import { DisplayHeaderQueue } from './components/display-header-queue';
import {
  DisplayCurrentQueue,
  QueueItem,
} from './components/display-current-queue';
import { DisplayTableQueue } from './components/display-table-queue';
import { DisplayFooterQueue } from './components/display-footer-queue';

export default function DisplayPage() {
  // Fetch refresh interval from system config
  const { data: refreshConfig } = useSystemConfigByKey('REFRESH_INTERVAL_MS');
  const refreshInterval = refreshConfig?.config_value
    ? parseInt(refreshConfig.config_value, 10)
    : 5000; // Default 5 seconds

  const { data: activeQueuesData } = useActiveQueues(1, 10, refreshInterval);
  const allQueues = activeQueuesData?.data || [];

  const currentQueueData = allQueues.length > 0 ? allQueues[0] : null;
  const waitingQueuesData = allQueues.length > 0 ? allQueues.slice(1) : [];

  const currentQueue: QueueItem | null = currentQueueData
    ? {
        queueNumber: currentQueueData.queue_number,
        status: currentQueueData.current_status,
        driverName: currentQueueData.driver_name,
        companyName: currentQueueData.snapshot_company_name || '-',
      }
    : null;

  const waitingQueues: QueueItem[] = waitingQueuesData.map((q) => ({
    queueNumber: q.queue_number,
    status: q.current_status,
    driverName: q.driver_name,
    companyName: q.snapshot_company_name || '-',
  }));

  return (
    <>
      {/* Main Card */}
      <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm shadow-2xl pb-14">
        {/* Header */}
        <DisplayHeaderQueue />

        {/* Main Content */}
        <main className="relative flex-1 grid grid-cols-12 gap-4 p-4 min-h-0">
          {/* Current Queue - Left Side */}
          <div className="col-span-5 h-full">
            <DisplayCurrentQueue currentQueue={currentQueue} />
          </div>

          {/* Queue Table - Right Side */}
          <div className="col-span-7 h-full min-h-0">
            <DisplayTableQueue
              queues={waitingQueues}
              title="Antrean Berikutnya"
            />
          </div>
        </main>
      </div>

      {/* Footer - Fixed at bottom, outside card */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <DisplayFooterQueue />
      </div>
    </>
  );
}
