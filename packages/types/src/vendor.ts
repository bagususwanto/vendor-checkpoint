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

export const updateVendorSchema = z.object({
  vendor_code: z.string().optional(),
  company_name: z.string().optional(),
  is_active: z.boolean().optional(),
  vendor_category_id: z.coerce.number().optional(),
});

export type FindVendorParams = z.infer<typeof findVendorParamsSchema>;
export type UpdateVendorPayload = z.infer<typeof updateVendorSchema>;

export type findVendorResponse = {
  vendor_id: number;
  company_name: string;
  vendor_code: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  vendor_category_id?: number | null;
  vendor_category?: string | null;
};

export type SyncResult = {
  created: number;
  updated: number;
  total: number;
  syncTime: Date | string; // Date on backend, string (ISO) on frontend
};
