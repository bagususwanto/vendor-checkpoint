import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorPerformanceService } from '@/services/vendor-performance.service';
import { CreateAdjustmentPayload, AdjustmentFilter } from '@repo/types';
import { toast } from 'sonner';

export const useAdjustments = (filter: AdjustmentFilter) => {
  return useQuery({
    queryKey: ['performance-adjustments', filter],
    queryFn: () => vendorPerformanceService.getAdjustments(filter),
  });
};

export const useAdjustmentByEntry = (entryId: number | null) => {
  return useQuery({
    queryKey: ['performance-adjustment', entryId],
    queryFn: () => vendorPerformanceService.getAdjustmentByEntryId(entryId!),
    enabled: !!entryId,
  });
};

export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdjustmentPayload) => 
      vendorPerformanceService.createAdjustment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-ranking'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-trend'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-detail'] });
      queryClient.invalidateQueries({ queryKey: ['performance-adjustments'] });
      queryClient.invalidateQueries({ queryKey: ['performance-adjustment'] });
      toast.success('Adjustment berhasil disimpan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan adjustment');
    },
  });
};

export const useDeleteAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vendorPerformanceService.deleteAdjustment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-ranking'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-trend'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-detail'] });
      queryClient.invalidateQueries({ queryKey: ['performance-adjustments'] });
      queryClient.invalidateQueries({ queryKey: ['performance-adjustment'] });
      toast.success('Adjustment berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus adjustment');
    },
  });
};
