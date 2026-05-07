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
import { DelayReasonResponse } from '@repo/types';
import { ReasonTable } from './components/reason-table';
import { ReasonForm } from './components/reason-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDelayReasons } from '@/hooks/api/use-delay-reasons';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';

export default function DelayReasonPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedReason, setSelectedReason] = React.useState<DelayReasonResponse | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<'Arrival' | 'Departure'>('Arrival');

  // Separate pagination state per tab
  const [arrivalPage, setArrivalPage] = React.useState(1);
  const [arrivalLimit, setArrivalLimit] = React.useState(10);
  const [arrivalSearch, setArrivalSearch] = React.useState('');
  const [arrivalSearchInput, setArrivalSearchInput] = React.useState('');

  const [departurePage, setDeparturePage] = React.useState(1);
  const [departureLimit, setDepartureLimit] = React.useState(10);
  const [departureSearch, setDepartureSearch] = React.useState('');
  const [departureSearchInput, setDepartureSearchInput] = React.useState('');

  const { data: arrivalResult, isLoading: arrivalLoading } = useDelayReasons({
    category: 'Arrival',
    page: arrivalPage,
    limit: arrivalLimit,
    search: arrivalSearch || undefined,
  });

  const { data: departureResult, isLoading: departureLoading } = useDelayReasons({
    category: 'Departure',
    page: departurePage,
    limit: departureLimit,
    search: departureSearch || undefined,
  });

  const handleAddReason = () => {
    setSelectedReason(null);
    setIsDialogOpen(true);
  };

  const handleEditReason = (reason: DelayReasonResponse) => {
    setSelectedReason(reason);
    setIsDialogOpen(true);
  };

  const handleTabChange = (val: string) => {
    setActiveCategory(val as 'Arrival' | 'Departure');
  };

  const handleArrivalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setArrivalSearch(arrivalSearchInput);
    setArrivalPage(1);
  };

  const handleDepartureSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDepartureSearch(departureSearchInput);
    setDeparturePage(1);
  };

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Alasan Keterlambatan</h2>
            <p className="text-muted-foreground text-sm">
              Kelola master data alasan keterlambatan kedatangan dan keberangkatan vendor.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddReason}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Alasan
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Alasan</CardTitle>
            <CardDescription>
              Alasan ini akan ditampilkan sebagai pilihan dropdown pada saat proses check-in/check-out vendor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={handleTabChange} className="space-y-4">
              <TabsList>
                <TabsTrigger value="Arrival">Kedatangan (Arrival)</TabsTrigger>
                <TabsTrigger value="Departure">Keberangkatan (Departure)</TabsTrigger>
              </TabsList>

              <TabsContent value="Arrival" className="space-y-4">
                <form onSubmit={handleArrivalSearch} className="flex items-center gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari teks alasan..."
                      className="pl-8"
                      value={arrivalSearchInput}
                      onChange={(e) => setArrivalSearchInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm">Cari</Button>
                  {arrivalSearch && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setArrivalSearch(''); setArrivalSearchInput(''); setArrivalPage(1); }}
                    >
                      Reset
                    </Button>
                  )}
                </form>
                <ReasonTable
                  data={arrivalResult?.data ?? []}
                  isLoading={arrivalLoading}
                  page={arrivalResult?.meta.page ?? arrivalPage}
                  limit={arrivalLimit}
                  total={arrivalResult?.meta.total ?? 0}
                  totalPages={arrivalResult?.meta.total_pages ?? 0}
                  onPageChange={setArrivalPage}
                  onLimitChange={(l) => { setArrivalLimit(l); setArrivalPage(1); }}
                  onEdit={handleEditReason}
                />
              </TabsContent>

              <TabsContent value="Departure" className="space-y-4">
                <form onSubmit={handleDepartureSearch} className="flex items-center gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari teks alasan..."
                      className="pl-8"
                      value={departureSearchInput}
                      onChange={(e) => setDepartureSearchInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm">Cari</Button>
                  {departureSearch && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setDepartureSearch(''); setDepartureSearchInput(''); setDeparturePage(1); }}
                    >
                      Reset
                    </Button>
                  )}
                </form>
                <ReasonTable
                  data={departureResult?.data ?? []}
                  isLoading={departureLoading}
                  page={departureResult?.meta.page ?? departurePage}
                  limit={departureLimit}
                  total={departureResult?.meta.total ?? 0}
                  totalPages={departureResult?.meta.total_pages ?? 0}
                  onPageChange={setDeparturePage}
                  onLimitChange={(l) => { setDepartureLimit(l); setDeparturePage(1); }}
                  onEdit={handleEditReason}
                />
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
    </RoleGuard>
  );
}
