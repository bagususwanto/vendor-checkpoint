'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, History } from 'lucide-react';
import { useAdjustments } from '@/hooks/api/use-performance-adjustment';
import { AdjustmentLogTable } from '../components/adjustment-log-table';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';

export default function PerformanceAdjustmentsPage() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data: adjustments, isLoading } = useAdjustments({
    page,
    limit,
  });

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.SECTION_HEAD,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <History className="h-8 w-8 text-primary" />
                Adjustment Logs
              </h2>
              <p className="text-muted-foreground">
                Daftar riwayat penyesuaian performa vendor yang dilakukan oleh Admin/Section Head
              </p>
            </div>
          </div>
        </div>
        
        <Separator />

        <div className="grid gap-4">
          <AdjustmentLogTable
            data={adjustments?.data || []}
            isLoading={isLoading}
            page={page}
            limit={limit}
            total={adjustments?.meta.total || 0}
            totalPages={adjustments?.meta.total_pages || 1}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
