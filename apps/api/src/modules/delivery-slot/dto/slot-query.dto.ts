import { createZodDto } from 'nestjs-zod';
import { findDeliverySlotParamsSchema, findMissedSlotParamsSchema } from '@repo/types';

export class FindDeliverySlotDto extends createZodDto(findDeliverySlotParamsSchema) {}
export class FindMissedSlotDto extends createZodDto(findMissedSlotParamsSchema) {}
