import { z } from 'zod';

export const createDelayReasonSchema = z.object({
  category: z.enum(['Arrival', 'Departure']),
  reason_text: z.string().min(1).max(255),
  is_active: z.boolean().default(true),
});

export type CreateDelayReason = z.infer<typeof createDelayReasonSchema>;

export const updateDelayReasonSchema = createDelayReasonSchema.partial();
export type UpdateDelayReason = z.infer<typeof updateDelayReasonSchema>;

export const findDelayReasonParamsSchema = z.object({
  category: z.enum(['Arrival', 'Departure']).optional(),
  isActive: z.union([z.boolean(), z.string().transform(val => val === 'true')]).optional(),
});
export type FindDelayReasonParams = z.infer<typeof findDelayReasonParamsSchema>;

export type DelayReasonResponse = {
  delay_reason_id: number;
  category: string;
  reason_text: string;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};
