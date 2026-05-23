import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { vendorService } from '@/services/vendor.service';
import {
  FindVendorParams,
  PaginatedResponse,
  findVendorResponse,
} from '@repo/types';
import { toast } from 'sonner';

// Keys for query invalidation
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (params: Partial<FindVendorParams>) =>
    [...vendorKeys.lists(), params] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: number) => [...vendorKeys.details(), id] as const,
};

// Paginated query for data table
export function useVendorsPaginated(
  params: FindVendorParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<findVendorResponse>>>,
) {
  return useQuery({
    queryKey: vendorKeys.list(params),
    queryFn: () => vendorService.getVendors(params),
    ...options,
  });
}

// Infinite query for combobox/dropdown (used in check-in form)
export function useVendors(
  params: Omit<FindVendorParams, 'page' | 'limit'>,
  options?: Partial<
    UseInfiniteQueryOptions<PaginatedResponse<findVendorResponse>>
  >,
) {
  return useInfiniteQuery({
    queryKey: ['vendors-infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await vendorService.getVendors({
        ...params,
        page: pageParam as number,
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
    ...(options as any),
  });
}

// Get single vendor
export function useVendor(id: number) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => vendorService.getVendorById(id),
    enabled: !!id,
  });
}

// Sync vendors mutation (with polling)
export function useSyncVendors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => vendorService.syncVendors(),
    onMutate: () => {
      toast.loading('Sync dimulai...', { duration: Infinity, id: 'sync' });
    },
    onSuccess: (data) => {
      toast.dismiss('sync');
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(
        `Sync berhasil: ${data.created} vendor baru, ${data.updated} diperbarui`,
        { duration: 10000 },
      );
    },
    onError: (error: any) => {
      toast.dismiss('sync');
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Gagal sync vendor dari sistem eksternal';
      toast.error(errorMsg, {
        duration: 10000,
      });
    },
  });
}
