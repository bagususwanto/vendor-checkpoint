'use client';

import { useSystemConfigByKey } from '@/hooks/api/use-system-config';
import { useDeliverySlotMonitor } from '@/hooks/api/use-delivery-slots';
import { MonitorHeader } from './components/monitor-header';
import { MonitorSummaryPanel, MonitorStats } from './components/monitor-summary-panel';
import { MonitorSlotTable, ParsedMonitorSlot, DisplayStatus } from './components/monitor-slot-table';
import { DeliverySlotMonitorItem } from '@repo/types';

export default function MonitorPage() {
  const { data: refreshConfig } = useSystemConfigByKey('REFRESH_INTERVAL_MS');
  const refreshInterval = refreshConfig?.config_value
    ? parseInt(refreshConfig.config_value, 10)
    : 10000;

  const { data: bufferConfig } = useSystemConfigByKey('ARRIVAL_BUFFER_MINUTES');
  const arrivalBufferMinutes = bufferConfig?.config_value
    ? parseInt(bufferConfig.config_value, 10)
    : 15;

  const { data: slotsData } = useDeliverySlotMonitor(refreshInterval);
  const slots = slotsData || [];
  const now = new Date();

  function deriveDisplayStatus(slot: DeliverySlotMonitorItem): DisplayStatus {
    const latestEntry = slot.ops_checkin_entry?.[0];
    if (slot.status === 'Missed') return 'MISSED';
    if (latestEntry) {
      if (latestEntry.current_status === 'SELESAI') return 'COMPLETED';
      if (latestEntry.current_status === 'AKTIF') return 'IN_PROGRESS';
      return 'ARRIVED';
    }
    if (slot.schedule?.arrival_time) {
      const parts = slot.schedule.arrival_time.split(':').map(Number);
      const hours = parts[0] ?? 0;
      const minutes = parts[1] ?? 0;
      const scheduleTime = new Date(now);
      scheduleTime.setHours(hours, minutes, 0, 0);
      const bufferMs = arrivalBufferMinutes * 60 * 1000;
      if (now.getTime() > scheduleTime.getTime() + bufferMs) return 'OVERDUE';
    }
    return 'PENDING';
  }

  const parsedSlots: ParsedMonitorSlot[] = slots.map((slot) => {
    const status = deriveDisplayStatus(slot);
    let arrivalTime = null;
    const latestEntry = slot.ops_checkin_entry?.[0];
    if (latestEntry && latestEntry.submission_time) {
      arrivalTime = new Date(latestEntry.submission_time).toLocaleTimeString('id-ID', {
        hour12: false, hour: '2-digit', minute: '2-digit',
      });
    }
    return {
      id: String(slot.slot_id),
      expectedTime: slot.schedule?.arrival_time || '-',
      companyName: slot.schedule?.vendor?.company_name || '-',
      vendorCode: slot.schedule?.vendor?.vendor_code || '-',
      rit: slot.schedule?.rit || 1,
      truckStation: slot.schedule?.truck_station || null,
      status,
      arrivalTime,
    };
  });

  const stats: MonitorStats = {
    total: parsedSlots.length,
    inProgress: parsedSlots.filter(s => s.status === 'IN_PROGRESS' || s.status === 'ARRIVED').length,
    completed: parsedSlots.filter(s => s.status === 'COMPLETED').length,
    pending: parsedSlots.filter(s => s.status === 'PENDING').length,
    overdue: parsedSlots.filter(s => s.status === 'OVERDUE').length,
    missed: parsedSlots.filter(s => s.status === 'MISSED').length,
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* Header */}
      <MonitorHeader />

      {/* Main Content */}
      <main className="relative flex-1 grid grid-cols-12 gap-5 p-5 min-h-0 z-10 transition-all">
        {/* Left Column - Summary */}
        <div className="col-span-3 h-full animate-in slide-in-from-left duration-700">
          <MonitorSummaryPanel stats={stats} />
        </div>

        {/* Right Column - Table */}
        <div className="col-span-9 h-full min-h-0 animate-in slide-in-from-right duration-700">
          <MonitorSlotTable slots={parsedSlots} />
        </div>
      </main>

      {/* Subtle Pattern Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}
