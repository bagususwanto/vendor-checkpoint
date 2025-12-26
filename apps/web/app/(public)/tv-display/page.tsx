'use client';

import { DisplayHeaderQueue } from './components/display-header-queue';
import {
  DisplayCurrentQueue,
  QueueItem,
} from './components/display-current-queue';
import { DisplayTableQueue } from './components/display-table-queue';
import { DisplayFooterQueue } from './components/display-footer-queue';
import { useState, useEffect } from 'react';

// Mock Data Generation
const generateMockQueues = (): QueueItem[] => {
  return [
    {
      queueNumber: '20251226-002',
      status: 'WAITING',
      driverName: 'Budi Santoso',
      companyName: 'PT. Logistik Jaya',
    },
    {
      queueNumber: '20251226-005',
      status: 'WAITING',
      driverName: 'Ahmad Dani',
      companyName: 'CV. Maju Terus',
    },
    {
      queueNumber: '20251226-003',
      status: 'WAITING',
      driverName: 'Cipto Mangunkusumo',
      companyName: 'PT. Sumber Rejeki',
    },
    {
      queueNumber: '20251226-004',
      status: 'WAITING',
      driverName: 'Dewi Sartika',
      companyName: 'PT. Kimia Farma',
    },
    {
      queueNumber: '20251226-007',
      status: 'WAITING',
      driverName: 'Eko Patrio',
      companyName: 'PT. Gudang Garam',
    },
    {
      queueNumber: '20251226-006',
      status: 'WAITING',
      driverName: 'Fajar Sadboy',
      companyName: 'CV. Abadi Jaya',
    },
  ];
};

export default function TvDisplayPage() {
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>({
    queueNumber: '20251226-001',
    status: 'CALLED',
    driverName: 'Siti Badriah',
    companyName: 'PT. Indofood Sukses Makmur',
  });
  const [waitingQueues, setWaitingQueues] = useState<QueueItem[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setWaitingQueues(generateMockQueues());

    // Simulate updating current queue periodically for demo purpose
    const interval = setInterval(() => {
      // Logic to rotate queues could go here
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
