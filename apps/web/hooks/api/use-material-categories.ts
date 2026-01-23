import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { materialCategoryService } from '@/services/material-category.service';
import { FindMaterialCategoryParams } from '@repo/types';
import { toast } from 'sonner';

export const materialCategoryKeys = {
  all: ['material-categories'] as const,
  lists: () => [...materialCategoryKeys.all, 'list'] as const,
  list: (params: FindMaterialCategoryParams) =>
    [...materialCategoryKeys.lists(), params] as const,
  details: () => [...materialCategoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...materialCategoryKeys.details(), id] as const,
  selection: () => [...materialCategoryKeys.all, 'selection'] as const,
};

export function useMaterialCategorySelection() {
  return useQuery({
    queryKey: materialCategoryKeys.selection(),
    queryFn: () => materialCategoryService.getSelection(),
  });
}

export function useMaterialCategories(
  params: Partial<FindMaterialCategoryParams> = {},
) {
  const finalParams: FindMaterialCategoryParams = {
    page: 1,
    limit: 10,
    status: 'all',
    ...params,
  };

  return useQuery({
    queryKey: materialCategoryKeys.list(finalParams),
    queryFn: () => materialCategoryService.getAll(finalParams),
    placeholderData: (previousData) => previousData,
  });
}

export function useInfiniteMaterialCategories(
  params: Partial<FindMaterialCategoryParams> = {},
) {
  const finalParams: FindMaterialCategoryParams = {
    page: 1,
    limit: 10,
    status: 'all',
    ...params,
  };

  return useInfiniteQuery({
    queryKey: [...materialCategoryKeys.lists(), 'infinite', finalParams],
    queryFn: ({ pageParam = 1 }) =>
      materialCategoryService.getAll({ ...finalParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.total_pages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useGetMaterialCategory(id: number) {
  return useQuery({
    queryKey: materialCategoryKeys.detail(id),
    queryFn: () => materialCategoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMaterialCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialCategoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialCategoryKeys.lists() });
      toast.success('Berhasil membuat kategori material');
    },
    onError: (error: any) => {
      toast.error('Gagal membuat kategori material', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useUpdateMaterialCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      materialCategoryService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialCategoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: materialCategoryKeys.detail(data.material_category_id),
      });
      toast.success('Berhasil memperbarui kategori material');
    },
    onError: (error: any) => {
      toast.error('Gagal memperbarui kategori material', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useDeleteMaterialCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialCategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialCategoryKeys.lists() });
      toast.success('Berhasil menghapus kategori material');
    },
    onError: (error: any) => {
      toast.error('Gagal menghapus kategori material', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useBulkDeleteMaterialCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialCategoryService.bulkDelete,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: materialCategoryKeys.lists() });
      toast.success(`Berhasil menghapus ${data.count} kategori material`);
    },
    onError: (error: any) => {
      toast.error('Gagal menghapus data', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useToggleMaterialCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: materialCategoryService.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialCategoryKeys.lists() });
      toast.success('Status kategori berhasil diubah');
    },
    onError: (error: any) => {
      toast.error('Gagal mengubah status', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}
