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
});
export type FindDelayReasonParams = z.infer<typeof findDelayReasonParamsSchema>;
