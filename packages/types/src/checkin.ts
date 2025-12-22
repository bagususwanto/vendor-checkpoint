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

export const queueSearchSchema = z.object({
  queueNumber: z.string().min(1, 'Nomor antrean harus diisi'),
});

export type QueueSearch = z.infer<typeof queueSearchSchema>;

export const checkInSchema = z.object({
  vendor_id: z.number(),
  driver_name: z.string(),
  checklist_responses: z.array(
    z.object({
      checklist_item_id: z.number(),
      response_value: z.boolean(),
    }),
  ),
});

export type CheckIn = z.infer<typeof checkInSchema>;
