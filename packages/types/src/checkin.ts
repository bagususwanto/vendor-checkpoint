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
  vendor_code?: string;
  ops_queue_status: {
    priority_order: number;
    estimated_wait_minutes: number;
    status_display_text?: string;
  };
};

export type VerificationList = {
  queue_number: string;
  snapshot_company_name: string;
  driver_name: string;
  snapshot_category_name: string;
  submission_time: Date;
  current_status: string;
  dn_number?: string;
  po_number?: string;
  arrival_status?: string;
  ai_safety_status?: string;
  ops_timelog?: {
    departure_status?: string;
  };
};

export const queueSearchSchema = z.object({
  queueNumber: z.string().min(1, 'Nomor antrean harus diisi'),
});

export type QueueSearch = z.infer<typeof queueSearchSchema>;

export const checkInSchema = z.object({
  vendor_id: z.number(),
  driver_name: z.string(),
  dn_number: z.string().optional(),
  po_number: z.string().optional(),
  arrival_status: z.string().optional(), 
  delay_arrival_reason_id: z.number().optional(),
  ai_safety_status: z.string().optional(),
  ppe_has_hardhat: z.boolean().optional(),
  ppe_has_safety_vest: z.boolean().optional(),
  ppe_image_path: z.string().optional(),
  snapshot_vendor_category_id: z.number().optional(),
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
});

export type VerifyCheckIn = z.infer<typeof verifyCheckInSchema>;

export const checkoutSchema = z.object({
  queue_number: z.string().min(1, 'Nomor antrean harus diisi'),
  departure_status: z.string().optional(),
  delay_departure_reason_id: z.number().optional(),
});

export type Checkout = z.infer<typeof checkoutSchema>;

export const holdCheckInSchema = z.object({
  queue_number: z.string().min(1, 'Nomor antrean harus diisi'),
  reason: z.string().min(1, 'Alasan penahanan harus diisi'),
});

export type HoldCheckIn = z.infer<typeof holdCheckInSchema>;

export const resumeCheckInSchema = z.object({
  queue_number: z.string().min(1, 'Nomor antrean harus diisi'),
});

export type ResumeCheckIn = z.infer<typeof resumeCheckInSchema>;

export const aiSafetySchema = z.object({
  image_base64: z.string().optional(), // Or use multipart/form-data logic in the controller itself
});

export type AiSafety = z.infer<typeof aiSafetySchema>;

export const departureScanSchema = z.object({
  departure_status: z.string(),
  delay_departure_reason_id: z.number().optional(),
});

export type DepartureScan = z.infer<typeof departureScanSchema>;

export const arrivalCheckResponseSchema = z.object({
  arrival_status: z.enum(['On-Time', 'Late', 'Early', 'Unscheduled']),
  planned_arrival_time: z.string().optional(),
  actual_time: z.string(),
  slot_id: z.number().nullable(),
});

export type ArrivalCheckResponse = z.infer<typeof arrivalCheckResponseSchema>;

export const officerDiscrepancyItemSchema = z.object({
  response_id: z.number().optional(),
  item_text_snapshot: z.string(),
  officer_note: z.string().optional(),
  evidence_image_path: z.string().optional(),
});

export type OfficerDiscrepancyItem = z.infer<typeof officerDiscrepancyItemSchema>;

export const submitDiscrepancySchema = z.object({
  queue_number: z.string().min(1),
  discrepancies: z.array(officerDiscrepancyItemSchema),
});

export type SubmitDiscrepancy = z.infer<typeof submitDiscrepancySchema>;
