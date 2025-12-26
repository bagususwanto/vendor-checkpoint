import { useInfiniteQuery } from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import { FindVendorParams } from '@repo/types';

export function useVendors(params: Omit<FindVendorParams, 'page' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: ['vendors', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await vendorService.getVendors({
        ...params,
        page: pageParam,
        limit: 10,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage.meta;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
