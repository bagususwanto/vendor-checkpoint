import { createZodDto } from 'nestjs-zod';
import {
  findDeliverySlotParamsSchema,
  findMissedSlotParamsSchema,
} from '@repo/types';

export class FindDeliverySlotDto extends createZodDto(
  findDeliverySlotParamsSchema,
) {
  declare date?: string;
  declare dateFrom?: string;
  declare dateTo?: string;
  declare status?: 'Open' | 'Filled' | 'Missed' | 'Check-In' | 'Delay';
  declare vendor_id?: number;
  declare page?: number;
  declare limit?: number;
}

export class FindMissedSlotDto extends createZodDto(
  findMissedSlotParamsSchema,
) {
  declare dateFrom?: string;
  declare dateTo?: string;
}
