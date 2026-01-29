import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { systemConfigService } from '@/services/system-config.service';
import { FindSystemConfigParams } from '@repo/types';
import { toast } from 'sonner';

export const systemConfigKeys = {
  all: ['system-configs'] as const,
  lists: () => [...systemConfigKeys.all, 'list'] as const,
  list: (params: FindSystemConfigParams) =>
    [...systemConfigKeys.lists(), params] as const,
  details: () => [...systemConfigKeys.all, 'detail'] as const,
  detail: (id: number) => [...systemConfigKeys.details(), id] as const,
  detailByKey: (key: string) =>
    [...systemConfigKeys.details(), 'key', key] as const,
};

export function useSystemConfigs(params: Partial<FindSystemConfigParams> = {}) {
  const finalParams: FindSystemConfigParams = {
    page: 1,
    limit: 10,
    ...params,
  };

  return useQuery({
    queryKey: systemConfigKeys.list(finalParams),
    queryFn: () => systemConfigService.getAll(finalParams),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetSystemConfig(id: number) {
  return useQuery({
    queryKey: systemConfigKeys.detail(id),
    queryFn: () => systemConfigService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateSystemConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      systemConfigService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: systemConfigKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: systemConfigKeys.detail(data.config_id),
      });
      // Also invalidate by key if possible, but we don't know the key here easily unless we return it
      toast.success('Berhasil memperbarui konfigurasi sistem');
    },
    onError: (error: any) => {
      toast.error('Gagal memperbarui konfigurasi sistem', {
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    },
  });
}

export function useSystemConfigByKey(key: string) {
  return useQuery({
    queryKey: systemConfigKeys.detailByKey(key),
    queryFn: () => systemConfigService.getByKey(key),
    enabled: !!key,
    staleTime: 5 * 60 * 1000, // 5 minutes - config doesn't change often
  });
}
