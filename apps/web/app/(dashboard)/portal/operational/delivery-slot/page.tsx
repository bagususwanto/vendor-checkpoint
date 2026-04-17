'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/use-debounce';
import { useDeliverySlots } from '@/hooks/api/use-delivery-slots';
import { SlotToolbar } from './components/slot-toolbar';
import { SlotTable } from './components/slot-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DeliverySlotPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState('all');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Parameter yang dikirimkan ke backend API, default ke hari ini
  const queryParams = {
    date: date ? format(date, 'yyyy-MM-dd') : undefined,
    status: status === 'all' ? undefined : (status as "Open" | "Filled" | "Missed" | "Check-In" | "Delay"),
  };

  const { data: slots, isLoading } = useDeliverySlots(queryParams, 10000); // Poll setiap 10 detik

  // Filter client-side jika butuh search by vendor
  const filteredSlots = (slots || []).filter((slot) => {
    if (!debouncedSearchTerm) return true;
    const vendorName = slot.schedule?.vendor?.company_name?.toLowerCase() || '';
    return vendorName.includes(debouncedSearchTerm.toLowerCase());
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
    setDate(new Date());
    setStatus('all');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoring Pengiriman</h2>
          <p className="text-muted-foreground text-sm">
            Pantau status kedatangan seluruh vendor secara *real-time* atau pada tanggal spesifik. Layar ini akan _auto-refresh_ setiap 10 detik.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Slot Pengiriman (Delivery Slots)</CardTitle>
          <CardDescription>
            Menampilkan seluruh vendor yang telah dise-jadwal oleh Generator untuk datang mengirimkan barang.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SlotToolbar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            date={date}
            setDate={setDate}
            status={status}
            setStatus={setStatus}
            onReset={handleReset}
          />

          <SlotTable
            data={filteredSlots}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
