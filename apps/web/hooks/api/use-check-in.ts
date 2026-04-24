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

export function useActiveQueues(
  page: number,
  limit: number,
  refetchInterval?: number,
) {
  return useQuery({
    queryKey: ['active-queues', page, limit],
    queryFn: () => checkInService.getActiveQueues({ page, limit }),
    refetchInterval: refetchInterval ?? 10000, // Default 10 seconds if not provided
  });
}

export function useVerificationList(
  page: number,
  limit: number,
  search?: string,
  filter?: {
    start_date?: string;
    end_date?: string;
    vendor_category_id?: string;
    status?: string;
  },
  refetchInterval?: number,
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
    refetchInterval: refetchInterval ?? 10000, // Default 10 seconds if not provided
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
    mutationFn: (payload: {
      queue_number: string;
      action: 'APPROVE' | 'REJECT';
      rejection_reason?: string;
    }) => checkInService.verifyCheckIn(payload),
  });
}

export function useCheckoutCheckIn() {
  return useMutation({
    mutationFn: (payload: { queue_number: string; departure_status?: string; delay_departure_reason_id?: number; }) =>
      checkInService.checkoutCheckIn(payload),
  });
}

export function useHoldCheckIn() {
  return useMutation({
    mutationFn: (payload: { queue_number: string; reason: string }) =>
      checkInService.holdCheckIn(payload),
  });
}

export function useResumeCheckIn() {
  return useMutation({
    mutationFn: (queueNumber: string) =>
      checkInService.resumeCheckIn(queueNumber),
  });
}

export function useArrivalCheck() {
  return useMutation({
    mutationFn: (vendorId: number) => checkInService.getArrivalCheck(vendorId),
  });
}

export function useDepartureCheck() {
  return useMutation({
    mutationFn: (queueNumber: string) => checkInService.getDepartureCheck(queueNumber),
  });
}

export function useUnscheduledMonitor(refetchInterval = 10000) {
  return useQuery({
    queryKey: ['unscheduled-monitor'],
    queryFn: () => checkInService.getUnscheduledMonitor(),
    refetchInterval,
    refetchIntervalInBackground: true,
  });
}
