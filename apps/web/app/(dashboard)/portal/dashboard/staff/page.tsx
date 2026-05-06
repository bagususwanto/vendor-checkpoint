'use client';

import { RecentCheckinsTable } from '../components/recent-checkins-table';
import { formatDateTime } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats } from '@/hooks/api/use-dashboard';
import { StatsCard } from '../components/stats-card';

export default function StaffDashboardPage() {
  const today = new Date();
  const { data: stats } = useDashboardStats();

  return (
    <div className="flex-1">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Dashboard Petugas
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDateTime(today, 'EEEE, dd MMMM yyyy')}</span>
            </div>
          </div>
          {/* {stats && (
            <Badge variant={stats.verification_mode ? 'default' : 'secondary'}>
              {stats.verification_mode
                ? 'Mode Verifikasi Staff'
                : 'Mode Self-Service'}
            </Badge>
          )} */}
        </div>
        {/* <Separator /> */}
        <StatsCard />
        <RecentCheckinsTable />
      </div>
    </div>
  );
}
