import { z } from 'zod';

export const findDeliverySlotParamsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').optional(),
  status: z.enum(['Open', 'Filled', 'Missed']).optional(),
  vendor_id: z.coerce.number().optional(),
});
export type FindDeliverySlotParams = z.infer<typeof findDeliverySlotParamsSchema>;

export const findMissedSlotParamsSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
export type FindMissedSlotParams = z.infer<typeof findMissedSlotParamsSchema>;
