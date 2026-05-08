'use client';

import { RecentCheckinsTable } from '../components/recent-checkins-table';
import { formatDateTime } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { StatsCard } from '../components/stats-card';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';

export default function StaffDashboardPage() {
  const today = new Date();

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.WAREHOUSE_STAFF,
        UserRole.WAREHOUSE_MEMBER,
      ]}
    >
      <div className="flex-1">
        <div className="space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Staff Dashboard
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
    </RoleGuard>
  );
}
