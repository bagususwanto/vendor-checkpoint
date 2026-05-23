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
    onMutate: () => {
      toast.loading('Sync User dimulai...', {
        duration: Infinity,
        id: 'sync-user',
      });
    },
    onSuccess: (data) => {
      toast.dismiss('sync-user');
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Sync User Berhasil', {
        description: `${data.created} user baru, ${data.updated} diperbarui dari ${data.total} total data.`,
        duration: 10000,
      });
    },
    onError: (error: any) => {
      toast.dismiss('sync-user');
      toast.error('Gagal Sync User', {
        description:
          error.response?.data?.message ||
          error.message ||
          'Terjadi kesalahan saat sync user.',
        duration: 10000,
      });
    },
  });
}
