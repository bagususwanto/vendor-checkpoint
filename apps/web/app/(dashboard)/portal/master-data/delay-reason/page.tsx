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
import { DelayReasonResponse } from '@repo/types';
import { ReasonTable } from './components/reason-table';
import { ReasonForm } from './components/reason-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DelayReasonPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<DelayReasonResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<'Arrival' | 'Departure'>('Arrival');

  const handleAddReason = () => {
    setSelectedReason(null);
    setIsDialogOpen(true);
  };

  const handleEditReason = (reason: DelayReasonResponse) => {
    setSelectedReason(reason);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alasan Keterlambatan</h2>
          <p className="text-muted-foreground text-sm">
            Kelola master data alasan keterlambatan kedatangan (Arrival) maupun keberangkatan (Departure) vendor.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddReason}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Alasan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Alasan</CardTitle>
              <CardDescription>
                Data alasan akan ditampilkan sebagai pilihan dropdown pada saat operasional entry check-in/out.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={(val) => setActiveCategory(val as 'Arrival' | 'Departure')} className="space-y-4">
            <TabsList>
              <TabsTrigger value="Arrival">Kedatangan (Arrival)</TabsTrigger>
              <TabsTrigger value="Departure">Keberangkatan (Departure)</TabsTrigger>
            </TabsList>
            <TabsContent value="Arrival" className="space-y-4">
               <ReasonTable category="Arrival" onEdit={handleEditReason} />
            </TabsContent>
            <TabsContent value="Departure" className="space-y-4">
               <ReasonTable category="Departure" onEdit={handleEditReason} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ReasonForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reason={selectedReason}
        defaultCategory={activeCategory}
      />
    </div>
  );
}
