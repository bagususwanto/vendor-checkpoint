import { findVendorResponse, FindDeliverySlotParams } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

// Since the DB has ops_delivery_slot, we approximate the type
export interface DeliverySlotResponse {
  slot_id: number;
  schedule_id: number;
  expected_date: string;
  status: 'Open' | 'Check-In' | 'Delay' | 'Missed';
  created_at: string;
  updated_at: string;
  schedule: {
    vendor_id: number;
    expected_arrival: string | null;
    vendor: findVendorResponse;
  };
  ops_checkin_entry?: any[];
}

export const deliverySlotService = {
  findAll: async (params: FindDeliverySlotParams): Promise<DeliverySlotResponse[]> => {
    const response = await axiosInstance.get<DeliverySlotResponse[]>('/delivery-slots', {
      params,
    });
    return response.data;
  },
};
