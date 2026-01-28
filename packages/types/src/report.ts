import { z } from 'zod';

export const reportFilterSchema = z.object({
  dateFrom: z.string().date('Invalid date format (YYYY-MM-DD)'),
  dateTo: z.string().date('Invalid date format (YYYY-MM-DD)'),
  status: z.string().optional(),
  materialCategoryId: z.coerce.number().optional(),
});

export type ReportFilter = z.infer<typeof reportFilterSchema>;

export const auditLogFilterSchema = z.object({
  dateFrom: z.string().date('Invalid date format (YYYY-MM-DD)'),
  dateTo: z.string().date('Invalid date format (YYYY-MM-DD)'),
  actionType: z.string().optional(),
  userId: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type AuditLogFilter = z.infer<typeof auditLogFilterSchema>;
