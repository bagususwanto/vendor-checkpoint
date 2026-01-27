import { createZodDto } from 'nestjs-zod';
import { createChecklistItemSchema } from '@repo/types';

export class CreateChecklistItemDto extends createZodDto(
  createChecklistItemSchema,
) {}
