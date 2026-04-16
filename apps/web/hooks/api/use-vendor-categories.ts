import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { vendorCategoryService } from '@/services/vendor-category.service';
import { FindVendorCategoryParams } from '@repo/types';
import { toast } from 'sonner';

export const vendorCategoryKeys = {
  all: ['vendor-categories'] as const,
  lists: () => [...vendorCategoryKeys.all, 'list'] as const,
  list: (params: FindVendorCategoryParams) =>
    [...vendorCategoryKeys.lists(), params] as const,
  details: () => [...vendorCategoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...vendorCategoryKeys.details(), id] as const,
  selection: () => [...vendorCategoryKeys.all, 'selection'] as const,
};

export function useVendorCategorySelection() {
  return useQuery({
    queryKey: vendorCategoryKeys.selection(),
    queryFn: () => vendorCategoryService.getSelection(),
  });
}

export function useVendorCategories(
  params: Partial<FindVendorCategoryParams> = {},
) {
  const finalParams: FindVendorCategoryParams = {
    page: 1,
    limit: 10,
    status: 'all',
    ...params,
  };

  return useQuery({
    queryKey: vendorCategoryKeys.list(finalParams),
    queryFn: () => vendorCategoryService.getAll(finalParams),
    placeholderData: (previousData) => previousData,
  });
}

export function useInfiniteVendorCategories(
  params: Partial<FindVendorCategoryParams> = {},
) {
  const finalParams: FindVendorCategoryParams = {
    page: 1,
    limit: 10,
    status: 'all',
    ...params,
  };

  return useInfiniteQuery({
    queryKey: [...vendorCategoryKeys.lists(), 'infinite', finalParams],
    queryFn: ({ pageParam = 1 }) =>
      vendorCategoryService.getAll({ ...finalParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.total_pages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useGetVendorCategory(id: number) {
  return useQuery({
    queryKey: vendorCategoryKeys.detail(id),
    queryFn: () => vendorCategoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateVendorCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorCategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorCategoryKeys.lists() });
      toast.success('Berhasil membuat kategori vendor');
    },
    onError: (error: any) => {
      toast.error('Gagal membuat kategori vendor', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useUpdateVendorCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      vendorCategoryService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vendorCategoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vendorCategoryKeys.detail(data.vendor_category_id),
      });
      toast.success('Berhasil memperbarui kategori vendor');
    },
    onError: (error: any) => {
      toast.error('Gagal memperbarui kategori vendor', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useDeleteVendorCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorCategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorCategoryKeys.lists() });
      toast.success('Berhasil menghapus kategori vendor');
    },
    onError: (error: any) => {
      toast.error('Gagal menghapus kategori vendor', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useBulkDeleteVendorCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorCategoryService.bulkDelete,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vendorCategoryKeys.lists() });
      toast.success(`Berhasil menghapus ${data.count} kategori vendor`);
    },
    onError: (error: any) => {
      toast.error('Gagal menghapus data', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useToggleVendorCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorCategoryService.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorCategoryKeys.lists() });
      toast.success('Status kategori berhasil diubah');
    },
    onError: (error: any) => {
      toast.error('Gagal mengubah status', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}
