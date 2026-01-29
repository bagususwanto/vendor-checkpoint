import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

export const userKeys = {
  all: ['users'] as const,
};

export function useSyncUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.syncUsers(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Sync User Berhasil', {
        description: `${data.created} user baru, ${data.updated} diperbarui dari ${data.total} total data.`,
        duration: 10000,
      });
    },
    onError: (error: any) => {
      toast.error('Gagal Sync User', {
        description:
          error.response?.data?.message || 'Terjadi kesalahan saat sync user.',
        duration: 10000,
      });
    },
  });
}
