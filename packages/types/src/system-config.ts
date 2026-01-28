import { z } from 'zod';

export const updateSystemConfigSchema = z.object({
  config_value: z.string().min(1, 'Nilai konfigurasi harus diisi'),
});

export type UpdateSystemConfig = z.infer<typeof updateSystemConfigSchema>;

export const findSystemConfigParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  config_type: z.string().optional(),
});

export type FindSystemConfigParams = z.infer<
  typeof findSystemConfigParamsSchema
>;

export type SystemConfigResponse = {
  config_id: number;
  config_key: string;
  config_value: string;
  config_type: string;
  description: string | null;
  is_editable: boolean;
  updated_by_user_id: number | null;
  created_at: Date;
  updated_at: Date;
};
