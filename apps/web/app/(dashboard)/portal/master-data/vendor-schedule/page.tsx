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
import { Plus, Search } from 'lucide-react';
import { VendorScheduleResponse } from '@repo/types';
import { ScheduleTable } from './components/schedule-table';
import { ScheduleForm } from './components/schedule-form';
import { useVendorSchedules } from '@/hooks/api/use-vendor-schedule';

export default function VendorSchedulePage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<VendorScheduleResponse | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');

  const { data: result, isLoading } = useVendorSchedules({ page, limit, search: search || undefined });

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsDialogOpen(true);
  };

  const handleEditSchedule = (schedule: VendorScheduleResponse) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
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
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama vendor..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline" size="sm">Cari</Button>
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
              >
                Reset
              </Button>
            )}
          </form>

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
