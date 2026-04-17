'use client';

import { useSystemConfigByKey } from '@/hooks/api/use-system-config';
import { useDeliverySlotMonitor } from '@/hooks/api/use-delivery-slots';
import { FidsHeader } from './components/fids-header';
import { FidsFooter } from './components/fids-footer';
import { FidsSummaryPanel, FidsStats } from './components/fids-summary-panel';
import { FidsSlotTable, ParsedFidsSlot, DisplayStatus } from './components/fids-slot-table';
import { DeliverySlotMonitorItem } from '@repo/types';

export default function FidsPage() {
  // Configs
  const { data: refreshConfig } = useSystemConfigByKey('REFRESH_INTERVAL_MS');
  const refreshInterval = refreshConfig?.config_value
    ? parseInt(refreshConfig.config_value, 10)
    : 10000; // Default 10 seconds

  const { data: bufferConfig } = useSystemConfigByKey('ARRIVAL_BUFFER_MINUTES');
  const arrivalBufferMinutes = bufferConfig?.config_value
    ? parseInt(bufferConfig.config_value, 10)
    : 15; // Default 15 minutes

  // Data
  const { data: slotsData } = useDeliverySlotMonitor(refreshInterval);
  const slots = slotsData || [];

  // Parse logic
  const now = new Date();

  function deriveDisplayStatus(slot: DeliverySlotMonitorItem): DisplayStatus {
    const latestEntry = slot.ops_checkin_entry?.[0];

    if (slot.status === 'Missed') return 'MISSED';

    if (latestEntry) {
      if (latestEntry.current_status === 'SELESAI') return 'COMPLETED';
      if (latestEntry.current_status === 'AKTIF') return 'IN_PROGRESS';
      return 'ARRIVED'; // MENUNGGU, DISETUJUI, TERTAHAN, dll
    }

    // Expected time parsing: arrival_time format is "HH:mm"
    if (slot.schedule?.arrival_time) {
      const parts = slot.schedule.arrival_time.split(':').map(Number);
      const hours = parts[0] ?? 0;
      const minutes = parts[1] ?? 0;
      const scheduleTime = new Date(now);
      scheduleTime.setHours(hours, minutes, 0, 0);

      const bufferMs = arrivalBufferMinutes * 60 * 1000;
      if (now.getTime() > scheduleTime.getTime() + bufferMs) {
        return 'OVERDUE';
      }
    }

    return 'PENDING';
  }

  // Parse list
  const parsedSlots: ParsedFidsSlot[] = slots.map((slot) => {
    const status = deriveDisplayStatus(slot);
    
    // format actual arrival time if exists
    let arrivalTime = null;
    const latestEntry = slot.ops_checkin_entry?.[0];
    if (latestEntry && latestEntry.submission_time) {
      const submissionDate = new Date(latestEntry.submission_time);
      arrivalTime = submissionDate.toLocaleTimeString('id-ID', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return {
      id: String(slot.slot_id),
      expectedTime: slot.schedule?.arrival_time || '-',
      companyName: slot.schedule?.vendor?.company_name || '-',
      vendorCode: slot.schedule?.vendor?.vendor_code || '-',
      status,
      arrivalTime,
    };
  });

  // Calculate Stats
  const stats: FidsStats = {
    total: parsedSlots.length,
    arrived: parsedSlots.filter(s => s.status === 'ARRIVED').length,
    inProgress: parsedSlots.filter(s => s.status === 'IN_PROGRESS').length,
    completed: parsedSlots.filter(s => s.status === 'COMPLETED').length,
    pending: parsedSlots.filter(s => s.status === 'PENDING').length,
    overdue: parsedSlots.filter(s => s.status === 'OVERDUE').length,
    missed: parsedSlots.filter(s => s.status === 'MISSED').length,
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Header */}
        <FidsHeader />

        {/* Main Content */}
        <main className="relative flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 bg-dot-pattern">
          {/* Summary - Left Side */}
          <div className="col-span-3 h-full">
            <FidsSummaryPanel stats={stats} />
          </div>

          {/* Schedule Table - Right Side */}
          <div className="col-span-9 h-full min-h-0">
            <FidsSlotTable slots={parsedSlots} />
          </div>
        </main>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <FidsFooter />
      </div>

      <style jsx global>{`
        .bg-dot-pattern {
          background-image: radial-gradient(hsl(var(--muted-foreground)/0.1) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </>
  );
}
