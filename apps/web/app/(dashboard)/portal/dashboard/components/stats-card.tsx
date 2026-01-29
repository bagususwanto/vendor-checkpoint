'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  XCircle,
  ListFilter,
  Timer,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/api/use-dashboard';
import { useSystemConfigByKey } from '@/hooks/api/use-system-config';
import { TrendData } from '@/services/dashboard.service';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  trend?: TrendData;
  inverse?: boolean; // If true, "up" is bad (red) and "down" is good (green)
}

function TrendIndicator({ trend, inverse = false }: TrendIndicatorProps) {
  if (!trend) return null;

  const { direction, percentage } = trend;

  if (direction === 'neutral') {
    return (
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Minus className="h-3 w-3 mr-1" />
        <span>0% dari kemarin</span>
      </div>
    );
  }

  const isPositiveGood = !inverse;
  // If direction is up: positive good -> green, positive bad -> red
  // If direction is down: positive good -> red, positive bad -> green

  let colorClass = '';
  if (direction === 'up') {
    colorClass = isPositiveGood ? 'text-emerald-500' : 'text-rose-500';
  } else {
    colorClass = isPositiveGood ? 'text-rose-500' : 'text-emerald-500';
  }

  const Icon = direction === 'up' ? ArrowUp : ArrowDown;

  return (
    <div className={cn('flex items-center text-xs mt-1', colorClass)}>
      <Icon className="h-3 w-3 mr-1" />
      <span>{percentage}% dari kemarin</span>
    </div>
  );
}

export function StatsCard() {
  // Fetch refresh interval from system config
  const { data: refreshConfig } = useSystemConfigByKey('REFRESH_INTERVAL_MS');
  const refreshInterval = refreshConfig?.config_value
    ? parseInt(refreshConfig.config_value, 10)
    : 60000; // Default 60 seconds

  const { data: stats, isLoading } = useDashboardStats(refreshInterval);

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
          <TrendIndicator trend={stats.trends?.total_checkins} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_approved}</div>
          <TrendIndicator trend={stats.trends?.total_approved} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          <XCircle className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_rejected}</div>
          <TrendIndicator trend={stats.trends?.total_rejected} inverse />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.current_waiting}</div>
          <p className="text-xs text-muted-foreground mt-1">Antrian saat ini</p>
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
          <TrendIndicator trend={stats.trends?.avg_lead_time} inverse />
        </CardContent>
      </Card>
    </div>
  );
}
