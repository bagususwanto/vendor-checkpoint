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
    status?: string;
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
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

export function useVerificationDetail(queueNumber: string) {
  return useQuery({
    queryKey: ['verification-detail', queueNumber],
    queryFn: () => checkInService.getVerificationDetail(queueNumber),
    enabled: !!queueNumber,
  });
}

export function useVerifyCheckIn() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { status: 'APPROVED' | 'REJECTED'; note?: string };
    }) => checkInService.verifyCheckIn(id, payload),
  });
}

export function useCheckoutCheckIn() {
  return useMutation({
    mutationFn: (id: string) => checkInService.checkoutCheckIn(id),
  });
}
