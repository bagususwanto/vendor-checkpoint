'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/api/use-auth';
import { UserRole } from '@repo/types';
import { Loader2 } from 'lucide-react';

// Role-based dashboard routes
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  [UserRole.GROUP_LEADER]: '/portal/dashboard/leader',
  [UserRole.WAREHOUSE_STAFF]: '/portal/dashboard/staff',
  [UserRole.SECTION_HEAD]: '/portal/dashboard/leader',
  [UserRole.SUPER_ADMIN]: '/portal/dashboard/leader',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user?.role) {
      const targetDashboard =
        ROLE_DASHBOARD_MAP[user.role] || '/portal/dashboard/admin';
      router.replace(targetDashboard);
    }
  }, [user, isLoading, router]);

  // Show loading while fetching user and redirecting
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
      </div>
    </div>
  );
}
