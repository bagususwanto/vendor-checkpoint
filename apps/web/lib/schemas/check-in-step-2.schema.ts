import { z } from 'zod';

export const CheckInStep2Schema = z.object({
  checklistItems: z.record(z.string(), z.enum(['true', 'false'])),
});

export type CheckInStep2Type = z.infer<typeof CheckInStep2Schema>;
