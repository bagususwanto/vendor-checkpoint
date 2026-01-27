import { createZodDto } from 'nestjs-zod';
import { updateChecklistItemSchema } from '@repo/types';

export class UpdateChecklistItemDto extends createZodDto(
  updateChecklistItemSchema,
) {}
