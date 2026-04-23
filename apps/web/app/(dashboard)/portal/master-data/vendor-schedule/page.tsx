'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, RefreshCw, Loader2 } from 'lucide-react';
import { VendorScheduleResponse } from '@repo/types';
import { ScheduleTable } from './components/schedule-table';
import { ScheduleForm } from './components/schedule-form';
import { ScheduleToolbar } from './components/schedule-toolbar';
import { useVendorSchedules } from '@/hooks/api/use-vendor-schedule';
import { useTriggerSlotGenerator } from '@/hooks/api/use-scheduler';
import { useDebounce } from '@/hooks/use-debounce';

export default function VendorSchedulePage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<VendorScheduleResponse | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [dayOfWeek, setDayOfWeek] = React.useState('');

  const debouncedSearch = useDebounce(search, 500);

  const { data: result, isLoading } = useVendorSchedules({ 
    page, 
    limit, 
    search: debouncedSearch || undefined,
    day_of_week: dayOfWeek ? Number(dayOfWeek) : undefined,
  });
  const { mutate: triggerGenerator, isPending: isTriggering } = useTriggerSlotGenerator();

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsDialogOpen(true);
  };

  const handleEditSchedule = (schedule: VendorScheduleResponse) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDayOfWeekChange = (value: string) => {
    setDayOfWeek(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setDayOfWeek('');
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jadwal Operasional Vendor</h2>
          <p className="text-muted-foreground text-sm">
            Tentukan hari operasional serta waktu kedatangan &amp; keberangkatan masing-masing vendor.
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
          <Button onClick={handleAddSchedule}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Jadwal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
          <CardDescription>
            Data ini menjadi acuan slot harian untuk menghitung Missed Cycle dan keterlambatan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScheduleToolbar
            searchTerm={search}
            onSearchChange={handleSearchChange}
            dayOfWeek={dayOfWeek}
            setDayOfWeek={handleDayOfWeekChange}
            onReset={handleReset}
          />

          <ScheduleTable
            data={result?.data ?? []}
            isLoading={isLoading}
            page={result?.meta.page ?? page}
            limit={limit}
            total={result?.meta.total ?? 0}
            totalPages={result?.meta.total_pages ?? 0}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            onEdit={handleEditSchedule}
          />
        </CardContent>
      </Card>

      <ScheduleForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        schedule={selectedSchedule}
      />
    </div>
  );
}
