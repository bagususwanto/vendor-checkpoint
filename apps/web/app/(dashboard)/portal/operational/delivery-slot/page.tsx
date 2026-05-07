'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/use-debounce';
import { useDeliverySlots } from '@/hooks/api/use-delivery-slots';
import { SlotToolbar } from './components/slot-toolbar';
import { SlotTable } from './components/slot-table';
import { SlotPagination } from './components/slot-pagination';
import { DateRange } from 'react-day-picker';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTriggerSlotGenerator } from '@/hooks/api/use-scheduler';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DeliverySlotPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Parameter yang dikirimkan ke backend API
  const queryParams = {
    dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
    dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
    status:
      status === 'all'
        ? undefined
        : (status as 'Open' | 'Filled' | 'Missed' | 'Check-In' | 'Delay'),
    page,
    limit,
  };

  const { data: paginatedData, isLoading } = useDeliverySlots(queryParams);
  const { mutate: triggerGenerator, isPending: isTriggering } = useTriggerSlotGenerator();

  const slots = paginatedData?.data || [];
  const meta = paginatedData?.meta;

  // Filter client-side jika butuh search by vendor
  // Catatan: Idealnya search dilakukan di server-side agar pagination akurat
  const filteredSlots = slots.filter((slot) => {
    if (!debouncedSearchTerm) return true;
    const vendorName = slot.schedule?.vendor?.company_name?.toLowerCase() || '';
    return vendorName.includes(debouncedSearchTerm.toLowerCase());
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset ke halaman pertama saat mencari
  };

  const handleReset = () => {
    setSearchTerm('');
    setDate({
      from: new Date(),
      to: new Date(),
    });
    status === 'all' ? null : setStatus('all');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset ke halaman pertama saat limit berubah
  };

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
        UserRole.SECTION_HEAD,
        UserRole.WAREHOUSE_STAFF,
        UserRole.WAREHOUSE_MEMBER,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Monitoring Pengiriman
            </h2>
            <p className="text-muted-foreground text-sm">
              Pantau status kedatangan seluruh vendor.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => triggerGenerator()}
              disabled={isTriggering}
            >
              {isTriggering ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Generate Slot Hari Ini
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Slot Pengiriman (Delivery Slots)</CardTitle>
            <CardDescription>
              Menampilkan seluruh vendor yang telah dijadwalkan oleh sistem untuk
              datang mengirimkan barang.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SlotToolbar
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              date={date}
              setDate={setDate}
              status={status}
              setStatus={(s) => {
                setStatus(s);
                setPage(1);
              }}
              onReset={handleReset}
            />

            <SlotTable
              data={filteredSlots}
              isLoading={isLoading}
              page={page}
              limit={limit}
            />

            {meta && (
              <SlotPagination
                total={meta.total}
                page={meta.page}
                limit={meta.limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
