import { useQuery } from '@tanstack/react-query';
import { deliverySlotService } from '@/services/delivery-slot.service';
import { FindDeliverySlotParams } from '@repo/types';

export const useDeliverySlots = (params: FindDeliverySlotParams, refetchInterval = 15000) => {
  return useQuery({
    queryKey: ['delivery-slots', params],
    queryFn: () => deliverySlotService.findAll({
      ...params,
    }),
    // Auto polling setiap `refetchInterval` ms (15 detik default) sehingga bisa dipakai memonitor layar yang selalu aktif.
    refetchInterval,
    // Jangan hentikan re-fetch meskipun layar kehilangan fokus
    refetchIntervalInBackground: true,
  });
};
