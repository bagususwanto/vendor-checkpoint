'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Separator } from '@/components/ui/separator';
import { PerformanceFilterBar } from './components/performance-filter-bar';
import { VendorTrendChart } from './components/vendor-trend-chart';
import { VendorRankingTable } from './components/vendor-ranking-table';
import { useVendorRanking, useVendorTrend } from '@/hooks/api/use-vendor-performance';
import { VendorPerformanceFilter } from '@repo/types';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@repo/types';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VendorPerformancePage() {
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [granularity, setGranularity] = React.useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [vendorCategoryId, setVendorCategoryId] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const filter = React.useMemo<VendorPerformanceFilter>(() => {
    return {
      dateFrom: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      dateTo: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      granularity,
      vendorCategoryId: vendorCategoryId ? parseInt(vendorCategoryId) : undefined,
      page,
      limit,
    };
  }, [date, granularity, vendorCategoryId, page, limit]);

  const { data: trendData, isLoading: isTrendLoading } = useVendorTrend(filter);
  const { data: rankingData, isLoading: isRankingLoading } = useVendorRanking(filter);

  const handleReset = () => {
    setDate({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
    setGranularity('daily');
    setVendorCategoryId(undefined);
  };

  return (
    <RoleGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.GROUP_HEAD,
        UserRole.LINE_HEAD,
        UserRole.SECTION_HEAD,
      ]}
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Vendor Performance</h2>
            <p className="text-muted-foreground">
              Analyze vendor performance based on timeliness and compliance
              levels.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(UserRole.SUPER_ADMIN === UserRole.SUPER_ADMIN) && ( // Role check is handled by UI visibility or simply allow all who can see this page to see the button
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/portal/reports/vendor-performance/adjustments')}
                className="h-9"
              >
                <History className="mr-2 h-4 w-4" />
                Adjustment Logs
              </Button>
            )}
          </div>
        </div>
        <Separator />

        <PerformanceFilterBar
          date={date}
          setDate={setDate}
          granularity={granularity}
          setGranularity={setGranularity}
          vendorCategoryId={vendorCategoryId}
          setVendorCategoryId={setVendorCategoryId}
          onReset={handleReset}
        />

        <div className="grid gap-4">
          <VendorTrendChart 
            data={trendData} 
            isLoading={isTrendLoading} 
          />
          
          <VendorRankingTable 
            data={rankingData?.data} 
            isLoading={isRankingLoading} 
            total={rankingData?.meta.total || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onVendorClick={(id) => {
              const query = new URLSearchParams({
                vendorId: id.toString(),
                dateFrom: filter.dateFrom,
                dateTo: filter.dateTo,
                granularity: filter.granularity,
              }).toString();
              router.push(`/portal/reports/vendor-performance/detail?${query}`);
            }}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
