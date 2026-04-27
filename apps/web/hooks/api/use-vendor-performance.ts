import { useQuery } from '@tanstack/react-query';
import { vendorPerformanceService } from '@/services/vendor-performance.service';
import { VendorPerformanceFilter } from '@repo/types';

export const useVendorRanking = (filter: VendorPerformanceFilter) => {
  return useQuery({
    queryKey: ['vendor-ranking', filter],
    queryFn: () => vendorPerformanceService.getRanking(filter),
    enabled: !!filter.dateFrom && !!filter.dateTo,
  });
};

export const useVendorTrend = (filter: VendorPerformanceFilter) => {
  return useQuery({
    queryKey: ['vendor-trend', filter],
    queryFn: () => vendorPerformanceService.getTrend(filter),
    enabled: !!filter.dateFrom && !!filter.dateTo,
  });
};

export const useVendorDetail = (vendorId: number | null, filter: VendorPerformanceFilter) => {
  return useQuery({
    queryKey: ['vendor-detail', vendorId, filter],
    queryFn: () => vendorPerformanceService.getVendorDetail(vendorId!, filter),
    enabled: !!vendorId && !!filter.dateFrom && !!filter.dateTo,
  });
};
