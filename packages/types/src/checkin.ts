import { z } from 'zod';

export const opsCheckinEntrySchema = z.object({
  queue_number: z.string(),
  vendor_id: z.number(),
  driver_name: z.string(),
  snapshot_vendor_category_id: z.number(),
  snapshot_company_name: z.string(),
  snapshot_category_name: z.string(),
  submission_time: z.string(),
  current_status: z.string(),
  has_non_compliant_items: z.boolean(),
  non_compliant_count: z.number(),
});

export type OpsCheckinEntry = z.infer<typeof opsCheckinEntrySchema>;

export const opsCheckinResponseSchema = z.object({
  checklist_item_id: z.number(),
  checklist_category_id: z.number(),
  item_text_snapshot: z.string(),
  item_type: z.string(),
  response_value: z.boolean(),
  is_compliant: z.boolean(),
  display_order: z.number(),
});

export type OpsCheckinResponse = z.infer<typeof opsCheckinResponseSchema>;

export const opsQueueStatusSchema = z.object({
  queue_number: z.string(),
  current_status: z.string(),
  status_display_text: z.string(),
  priority_order: z.number(),
  estimated_wait_minutes: z.number().optional(),
  last_updated: z.string().optional(),
});

export type OpsQueueStatus = z.infer<typeof opsQueueStatusSchema>;

export const checkinPayloadSchema = z.object({
  entry: opsCheckinEntrySchema,
  responses: z.array(opsCheckinResponseSchema),
  queue_status: opsQueueStatusSchema,
});

export type CheckinPayload = z.infer<typeof checkinPayloadSchema>;
