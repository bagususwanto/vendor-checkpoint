'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VendorScheduleResponse } from '@repo/types';
import { ScheduleTable } from './components/schedule-table';
import { ScheduleForm } from './components/schedule-form';

export default function VendorSchedulePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<VendorScheduleResponse | null>(null);

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsDialogOpen(true);
  };

  const handleEditSchedule = (schedule: VendorScheduleResponse) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jadwal Operasional Vendor</h2>
          <p className="text-muted-foreground text-sm">
            Tentukan hari operasional serta waktu kedatangan & keberangkatan masing-masing vendor.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddSchedule}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Jadwal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Jadwal</CardTitle>
          <CardDescription>
            Sistem secara otomatis akan menjadikan data ini sebagai acuan / Slot harian untuk menghitung *Missed Cycle* dan keterlambatan (Overdue).
          </CardDescription>
        </CardHeader>
        <CardContent>
           <ScheduleTable onEdit={handleEditSchedule} />
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
