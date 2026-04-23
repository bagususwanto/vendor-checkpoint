import { useQuery } from '@tanstack/react-query';
import {
  deliverySlotService,
  DeliverySlotResponse,
} from '@/services/delivery-slot.service';
import { FindDeliverySlotParams, PaginatedResponse } from '@repo/types';

export const useDeliverySlots = (
  params: FindDeliverySlotParams,
  refetchInterval?: number | false,
) => {
  return useQuery<PaginatedResponse<DeliverySlotResponse>>({
    queryKey: ['delivery-slots', params],
    queryFn: () =>
      deliverySlotService.findAll({
        ...params,
      }),
    refetchInterval,
  });
};

export const useDeliverySlotMonitor = (refetchInterval = 10000) => {
  return useQuery({
    queryKey: ['delivery-slot-monitor'],
    queryFn: () => deliverySlotService.findMonitor(),
    refetchInterval,
    refetchIntervalInBackground: true,
  });
};
