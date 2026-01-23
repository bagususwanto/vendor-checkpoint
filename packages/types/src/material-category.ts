import { z } from 'zod';

export const createMaterialCategorySchema = z.object({
  category_code: z
    .string()
    .min(1, 'Kode kategori harus diisi')
    .max(50, 'Kode kategori maksimal 50 karakter'),
  category_name: z
    .string()
    .min(1, 'Nama kategori harus diisi')
    .max(255, 'Nama kategori maksimal 255 karakter'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CreateMaterialCategory = z.infer<
  typeof createMaterialCategorySchema
>;

export const updateMaterialCategorySchema =
  createMaterialCategorySchema.partial();

export type UpdateMaterialCategory = z.infer<
  typeof updateMaterialCategorySchema
>;

export const bulkDeleteMaterialCategorySchema = z.object({
  ids: z.array(z.number()).min(1, 'Minimal 1 ID harus dipilih'),
});

export type BulkDeleteMaterialCategory = z.infer<
  typeof bulkDeleteMaterialCategorySchema
>;

export const findMaterialCategoryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional().default('all'),
});

export type FindMaterialCategoryParams = z.infer<
  typeof findMaterialCategoryParamsSchema
>;

export type MaterialCategoryResponse = {
  material_category_id: number;
  category_code: string;
  category_name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
