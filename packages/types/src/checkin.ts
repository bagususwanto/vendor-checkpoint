import { z } from 'zod';

export type QueueStatusData = {
  queueNumber: string;
  status: string;
  statusDisplayText: string;
  updatedAt: string;
  companyName: string;
  driverName: string;
  submissionTime: string;
  estimatedWaitTime?: string;
};

export type DisplayQueue = {
  queue_number: string;
  current_status: string;
  driver_name: string;
  snapshot_company_name: string;
  ops_queue_status: {
    priority_order: number;
    estimated_wait_minutes: number;
  };
};

export type VerificationList = {
  queue_number: string;
  snapshot_company_name: string;
  driver_name: string;
  snapshot_category_name: string;
  submission_time: Date;
  current_status: string;
};

export const queueSearchSchema = z.object({
  queueNumber: z.string().min(1, 'Nomor antrean harus diisi'),
});

export type QueueSearch = z.infer<typeof queueSearchSchema>;

export const checkInSchema = z.object({
  vendor_id: z.number(),
  driver_name: z.string(),
  material_category_id: z.number(),
  checklist_responses: z.array(
    z.object({
      checklist_item_id: z.number(),
      response_value: z.boolean(),
    }),
  ),
});

export type CheckIn = z.infer<typeof checkInSchema>;

export const verifyCheckInSchema = z.object({
  queue_number: z.string().min(1, 'Nomor antrean harus diisi'),
  action: z.enum(['APPROVE', 'REJECT']),
  rejection_reason: z.string().optional(),
  verified_by_user_id: z.number(),
});

export type VerifyCheckIn = z.infer<typeof verifyCheckInSchema>;

export const checkoutSchema = z.object({
  queue_number: z.string().min(1, 'Nomor antrean harus diisi'),
  checkout_by_user_id: z.number(),
});

export type Checkout = z.infer<typeof checkoutSchema>;
