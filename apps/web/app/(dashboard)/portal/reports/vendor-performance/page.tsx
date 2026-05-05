'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Separator } from '@/components/ui/separator';
import { PerformanceFilterBar } from './components/performance-filter-bar';
import { VendorTrendChart } from './components/vendor-trend-chart';
import { VendorRankingTable } from './components/vendor-ranking-table';
import { VendorDetailSheet } from './components/vendor-detail-sheet';
import { useVendorRanking, useVendorTrend } from '@/hooks/api/use-vendor-performance';
import { VendorPerformanceFilter } from '@repo/types';

export default function VendorPerformancePage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [granularity, setGranularity] = React.useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [vendorCategoryId, setVendorCategoryId] = React.useState<string | undefined>(undefined);
  const [selectedVendorId, setSelectedVendorId] = React.useState<number | null>(null);
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Performance</h2>
          <p className="text-muted-foreground">
            Analisis performa vendor berdasarkan tingkat ketepatan waktu dan kepatuhan
          </p>
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
          onVendorClick={(id) => setSelectedVendorId(id)}
        />
      </div>

      <VendorDetailSheet 
        vendorId={selectedVendorId}
        isOpen={selectedVendorId !== null}
        onClose={() => setSelectedVendorId(null)}
        filter={filter}
      />
    </div>
  );
}
