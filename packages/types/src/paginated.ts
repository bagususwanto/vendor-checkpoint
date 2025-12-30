import { z } from 'zod';

export const paginatedParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  filter: z.record(z.string(), z.string()).optional(),
});

export type PaginatedParams = z.infer<typeof paginatedParamsSchema>;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
