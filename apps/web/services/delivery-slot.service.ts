import {
  findVendorResponse,
  FindDeliverySlotParams,
  DeliverySlotMonitorItem,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

// Since the DB has ops_delivery_slot, we approximate the type
export interface DeliverySlotResponse {
  slot_id: number;
  schedule_id: number;
  expected_date: string;
  status: 'Open' | 'Filled' | 'Missed';
  created_at: string;
  updated_at: string;
  schedule: {
    vendor_id: number;
    arrival_time: string | null;
    departure_time: string | null;
    rit: number;
    truck_station: string | null;
    vendor: findVendorResponse;
  };
  ops_checkin_entry?: any[];
}

export const deliverySlotService = {
  findAll: async (
    params: FindDeliverySlotParams,
  ): Promise<DeliverySlotResponse[]> => {
    const response = await axiosInstance.get<{ data: DeliverySlotResponse[] }>(
      '/delivery-slots',
      {
        params,
      },
    );
    return response.data.data ?? [];
  },

  findMonitor: async (): Promise<DeliverySlotMonitorItem[]> => {
    const response = await axiosInstance.get<{
      data: DeliverySlotMonitorItem[];
    }>('/delivery-slots/monitor');
    return response.data.data ?? response.data; // nestjs standard response
  },
};
