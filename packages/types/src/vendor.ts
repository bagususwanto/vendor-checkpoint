import { z } from 'zod';

export const findVendorParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.preprocess((val) => {
    const str = String(val);
    if (str === 'true') return true;
    if (str === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
  categoryId: z.coerce.number().optional(),
});

export type FindVendorParams = z.infer<typeof findVendorParamsSchema>;
