'use client';

import { useState } from 'react';
import { useSystemConfigByKey } from '@/hooks/api/use-system-config';
import { useDeliverySlotMonitor } from '@/hooks/api/use-delivery-slots';
import { useUnscheduledMonitor } from '@/hooks/api/use-check-in';
import { MonitorHeader } from './components/monitor-header';
import {
  MonitorSummaryPanel,
  MonitorStats,
} from './components/monitor-summary-panel';
import {
  MonitorSlotTable,
  ParsedMonitorSlot,
  ArrivalDisplayStatus,
} from './components/monitor-slot-table';
import { UnscheduledSheet } from './components/unscheduled-sheet';
import { DeliverySlotMonitorItem } from '@repo/types';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MonitorPage() {
  const [isUnscheduledOpen, setIsUnscheduledOpen] = useState(false);

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

  const { data: unscheduledData } = useUnscheduledMonitor(refreshInterval);
  const unscheduled = unscheduledData || [];

  const now = new Date();

  function deriveArrivalStatus(
    slot: DeliverySlotMonitorItem,
  ): ArrivalDisplayStatus {
    const latestEntry = slot.ops_checkin_entry?.[0];
    if (latestEntry) {
      const arrStatus = latestEntry.arrival_status;
      if (arrStatus === 'On-Time') return 'ON_TIME';
      if (arrStatus === 'Late') return 'LATE';
      if (arrStatus === 'Early') return 'EARLY';
      // Sudah check-in tapi arrival_status belum di-set
      return 'ON_TIME';
    }
    if (slot.schedule?.arrival_time && slot.expected_date) {
      const parts = slot.schedule.arrival_time.split(':').map(Number);
      const hours = parts[0] ?? 0;
      const minutes = parts[1] ?? 0;

      const scheduleTime = new Date(slot.expected_date);

      // JIKA jam < 07:15, maka secara operasional ini adalah H+1 dari expected_date
      if (hours < 7 || (hours === 7 && minutes < 15)) {
        scheduleTime.setDate(scheduleTime.getDate() + 1);
      }

      scheduleTime.setHours(hours, minutes, 0, 0);
      const bufferMs = arrivalBufferMinutes * 60 * 1000;
      if (now.getTime() > scheduleTime.getTime() + bufferMs) return 'OVERDUE';
    }
    return 'PENDING';
  }

  const parsedSlots: ParsedMonitorSlot[] = slots.map((slot) => {
    const status = deriveArrivalStatus(slot);
    let arrivalTime = null;
    const latestEntry = slot.ops_checkin_entry?.[0];
    if (latestEntry && latestEntry.submission_time) {
      arrivalTime = new Date(latestEntry.submission_time).toLocaleTimeString(
        'en-US',
        {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        },
      );
    }
    let expectedDate = '-';
    if (slot.expected_date) {
      expectedDate = new Date(slot.expected_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    return {
      id: String(slot.slot_id),
      expectedTime: slot.schedule?.arrival_time || '-',
      expectedDate,
      companyName: slot.schedule?.vendor?.company_name || '-',
      vendorCode: slot.schedule?.vendor?.vendor_code || '-',
      rit: slot.schedule?.rit || 1,
      truckStation: slot.schedule?.truck_station || null,
      status,
      arrivalTime,
    };
  });

  // Frontend sort removed: sorting is now handled in the backend

  const stats: MonitorStats = {
    total: parsedSlots.length,
    onTime: parsedSlots.filter((s) => s.status === 'ON_TIME').length,
    late: parsedSlots.filter((s) => s.status === 'LATE').length,
    early: parsedSlots.filter((s) => s.status === 'EARLY').length,
    pending: parsedSlots.filter((s) => s.status === 'PENDING').length,
    overdue: parsedSlots.filter((s) => s.status === 'OVERDUE').length,
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* Header */}
      <MonitorHeader />

      {/* Main Content */}
      <main className="relative flex-1 grid grid-cols-12 gap-5 p-5 min-h-0 z-10 transition-all">
        {/* Left Column - Summary */}
        <div className="col-span-3 flex flex-col gap-4 h-full min-h-0 animate-in slide-in-from-left duration-700">
          <div className="flex-1 min-h-0">
            <MonitorSummaryPanel stats={stats} />
          </div>

          {/* Unscheduled Trigger Button */}
          <Button
            onClick={() => setIsUnscheduledOpen(true)}
            variant="outline"
            className="w-full h-16 shrink-0 flex items-center justify-between px-5 py-0 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-2 opacity-5 transform group-hover:scale-110 transition-transform">
              <Users size={40} />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">
                  Unscheduled
                </span>
                <span className="text-lg font-black text-primary leading-none">
                  Vendor
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center bg-primary text-white min-w-[28px] h-[28px] rounded-md font-black text-sm px-1.5 shadow-[0_2px_8px_rgba(249,115,22,0.3)]">
              {unscheduled.length}
            </div>
          </Button>
        </div>

        {/* Right Column - Table */}
        <div className="col-span-9 h-full min-h-0 animate-in slide-in-from-right duration-700">
          <MonitorSlotTable slots={parsedSlots} />
        </div>
      </main>

      {/* Unscheduled Detail Sheet */}
      <UnscheduledSheet
        open={isUnscheduledOpen}
        onOpenChange={setIsUnscheduledOpen}
        data={unscheduled}
      />

      {/* Subtle Pattern Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
