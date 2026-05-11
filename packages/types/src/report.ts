import { z } from 'zod';

export const reportFilterSchema = z.object({
  dateFrom: z.string().date('Invalid date format (YYYY-MM-DD)'),
  dateTo: z.string().date('Invalid date format (YYYY-MM-DD)'),
  status: z.string().optional(),
  vendorCategoryId: z.coerce.number().optional(),
  arrivalStatus: z.string().optional(),
  departureStatus: z.string().optional(),
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

export const vendorPerformanceFilterSchema = z.object({
  dateFrom: z.string().date('Invalid date format (YYYY-MM-DD)'),
  dateTo: z.string().date('Invalid date format (YYYY-MM-DD)'),
  granularity: z.enum(['daily', 'monthly', 'yearly']).default('daily'),
  vendorId: z.coerce.number().optional(),
  vendorCategoryId: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type VendorPerformanceFilter = z.infer<typeof vendorPerformanceFilterSchema>;

export const performanceAdjustmentSchema = z.object({
  adjustment_id: z.number(),
  entry_id: z.number(),
  adjusted_by_user_id: z.number(),
  original_arrival_status: z.string().nullable().optional(),
  adjusted_arrival_status: z.string().nullable().optional(),
  original_ai_safety_status: z.string().nullable().optional(),
  adjusted_ai_safety_status: z.string().nullable().optional(),
  original_ppe_compliant: z.boolean().nullable().optional(),
  adjusted_ppe_compliant: z.boolean().nullable().optional(),
  original_departure_status: z.string().nullable().optional(),
  adjusted_departure_status: z.string().nullable().optional(),
  override_has_non_compliant: z.boolean().nullable().optional(),
  adjustment_reason: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  // Including nested data for list view
  adjusted_by_user: z.object({
    full_name: z.string(),
  }).optional(),
  entry: z.object({
    queue_number: z.string(),
    snapshot_company_name: z.string(),
    driver_name: z.string(),
  }).optional(),
});

export type PerformanceAdjustment = z.infer<typeof performanceAdjustmentSchema>;

export const createAdjustmentSchema = z.object({
  entry_id: z.number(),
  adjusted_arrival_status: z.string().optional(),
  adjusted_ai_safety_status: z.string().optional(),
  adjusted_ppe_compliant: z.boolean().optional(),
  adjusted_departure_status: z.string().optional(),
  override_has_non_compliant: z.boolean().optional(),
  adjustment_reason: z.string().min(1, 'Alasan adjustment wajib diisi'),
});

export type CreateAdjustmentPayload = z.infer<typeof createAdjustmentSchema>;

export const adjustmentFilterSchema = z.object({
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  vendorId: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type AdjustmentFilter = z.infer<typeof adjustmentFilterSchema>;
