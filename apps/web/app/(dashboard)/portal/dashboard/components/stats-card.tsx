'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, ListFilter, Timer } from 'lucide-react';
import { useDashboardStats } from '@/hooks/api/use-dashboard';

export function StatsCard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Check-in</CardTitle>
          <ListFilter className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_checkins}</div>
          <p className="text-xs text-muted-foreground">Total keseluruhan</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_approved}</div>
          <p className="text-xs text-muted-foreground">
            {stats.approval_rate} tingkat persetujuan
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          <XCircle className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_rejected}</div>
          <p className="text-xs text-muted-foreground">
            {stats.rejected_rate} tingkat penolakan
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.current_waiting}</div>
          <p className="text-xs text-muted-foreground">Menunggu tinjauan</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rata-rata Waktu</CardTitle>
          <Timer className="h-4 w-4 text-sky-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.avg_lead_time_minutes}m
          </div>
          <p className="text-xs text-muted-foreground">Per proses selesai</p>
        </CardContent>
      </Card>
    </div>
  );
}
