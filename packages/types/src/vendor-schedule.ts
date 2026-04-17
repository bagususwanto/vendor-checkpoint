import { z } from 'zod';

export const createVendorScheduleSchema = z.object({
  vendor_id: z.number(),
  day_of_week: z.number().min(1).max(7),
  rit: z.number().min(1).default(1),
  arrival_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu harus HH:mm'),
  departure_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format waktu harus HH:mm'),
  truck_station: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type CreateVendorSchedule = z.infer<typeof createVendorScheduleSchema>;

export const updateVendorScheduleSchema = createVendorScheduleSchema.partial();
export type UpdateVendorSchedule = z.infer<typeof updateVendorScheduleSchema>;

export const findVendorScheduleParamsSchema = z.object({
  vendor_id: z.coerce.number().optional(),
  day_of_week: z.coerce.number().optional(),
});
export type FindVendorScheduleParams = z.infer<typeof findVendorScheduleParamsSchema>;

export type VendorScheduleResponse = {
  schedule_id: number;
  vendor_id: number;
  day_of_week: number;
  rit: number;
  arrival_time: string;
  departure_time: string;
  truck_station?: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  vendor?: {
    company_name: string;
    vendor_code: string;
  };
};
