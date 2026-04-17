import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulerService } from '@/services/scheduler.service';
import { toast } from 'sonner';

export const useTriggerSlotGenerator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schedulerService.triggerSlotGenerator,
    onSuccess: (data) => {
      toast.success('Berhasil', {
        description: data.message || 'Slot generator berhasil dijalankan.',
      });
      // Invalidate existing queries that might depend on schedule or delivery slots
      queryClient.invalidateQueries({ queryKey: ['vendor-schedules'] });
      // If delivery-slots query exists elsewhere, invalidating it too ensures consistency
      queryClient.invalidateQueries({ queryKey: ['delivery-slots'] });
    },
    onError: (error: any) => {
      toast.error('Gagal', {
        description: error?.response?.data?.message || 'Gagal menjalankan slot generator',
      });
    },
  });
};
