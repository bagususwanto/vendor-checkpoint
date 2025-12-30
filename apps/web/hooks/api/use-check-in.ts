import { useMutation, useQuery } from '@tanstack/react-query';
import { checkInService } from '@/services/check-in.service';
import { CheckIn } from '@repo/types';

export function useSubmitCheckIn() {
  return useMutation({
    mutationFn: (payload: CheckIn) => checkInService.submitCheckIn(payload),
  });
}

export function useQueueStatus(queueNumber: string | null) {
  return useQuery({
    queryKey: ['queue-status', queueNumber],
    queryFn: () => checkInService.getQueueStatus(queueNumber!),
    enabled: !!queueNumber,
    retry: false,
  });
}

export function useActiveQueues(page: number, limit: number) {
  return useQuery({
    queryKey: ['active-queues', page, limit],
    queryFn: () => checkInService.getActiveQueues({ page, limit }),
    refetchInterval: 10000,
  });
}

export function useVerificationList(
  page: number,
  limit: number,
  search?: string,
  filter?: {
    start_date?: string;
    end_date?: string;
    material_category_id?: string;
  },
) {
  return useQuery({
    queryKey: ['verification-list', page, limit, search, filter],
    queryFn: () =>
      checkInService.getVerificationList({
        page,
        limit,
        search,
        filter,
      }),
    refetchInterval: 5000, // Refresh every 5 seconds as requested "refresh terus"
  });
}
