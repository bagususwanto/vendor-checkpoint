import { z } from 'zod';
import { ChecklistItemType } from './enums';

export const checklistItemTypeSchema = z.nativeEnum(ChecklistItemType);

export const createChecklistCategorySchema = z.object({
  category_name: z
    .string()
    .min(1, 'Nama kategori harus diisi')
    .max(255, 'Nama kategori maksimal 255 karakter'),
  category_code: z
    .string()
    .min(1, 'Kode kategori harus diisi')
    .max(50, 'Kode kategori maksimal 50 karakter'),
  display_order: z.number().int().default(0),
  icon_name: z.string().optional(),
  color_code: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CreateChecklistCategory = z.infer<
  typeof createChecklistCategorySchema
>;

export const updateChecklistCategorySchema =
  createChecklistCategorySchema.partial();

export type UpdateChecklistCategory = z.infer<
  typeof updateChecklistCategorySchema
>;

export const createChecklistItemSchema = z.object({
  checklist_category_id: z.number().int(),
  item_code: z
    .string()
    .min(1, 'Kode item harus diisi')
    .max(100, 'Kode item maksimal 100 karakter'),
  item_text: z.string().min(1, 'Teks item harus diisi'),
  item_type: checklistItemTypeSchema,
  material_category_id: z.number().int().optional(),
  display_order: z.number().int().default(0),
  is_required: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

export type CreateChecklistItem = z.infer<typeof createChecklistItemSchema>;

export const updateChecklistItemSchema = createChecklistItemSchema.partial();

export type UpdateChecklistItem = z.infer<typeof updateChecklistItemSchema>;

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int(),
      display_order: z.number().int(),
    }),
  ),
});

export type Reorder = z.infer<typeof reorderSchema>;
