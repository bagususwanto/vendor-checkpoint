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
