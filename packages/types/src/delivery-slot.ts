import { z } from 'zod';

export const findDeliverySlotParamsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').optional(),
  status: z.enum(['Open', 'Filled', 'Missed', 'Check-In', 'Delay']).optional(),
  vendor_id: z.coerce.number().optional(),
});
export type FindDeliverySlotParams = z.infer<typeof findDeliverySlotParamsSchema>;

export const findMissedSlotParamsSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
export type FindMissedSlotParams = z.infer<typeof findMissedSlotParamsSchema>;

export type DeliverySlotMonitorItem = {
  slot_id: number;
  expected_date: Date | string;
  status: string; // Open | Filled | Missed | Check-In | Delay
  schedule: {
    schedule_id: number;
    arrival_time: string;   // "HH:mm"
    departure_time: string; // "HH:mm"
    rit: number;
    truck_station: string | null;
    vendor: {
      vendor_id: number;
      company_name: string;
      vendor_code: string;
      vendor_category?: { category_name: string } | null;
    };
  };
  ops_checkin_entry: Array<{
    entry_id: number;
    current_status: string;
    arrival_status: string | null;
    submission_time: Date | string;
    delay_arrival_reason_id: number | null; 
    ops_timelog: {
      checkin_time: Date | string | null;
      checkout_time: Date | string | null;
    } | null;
  }>;
};
