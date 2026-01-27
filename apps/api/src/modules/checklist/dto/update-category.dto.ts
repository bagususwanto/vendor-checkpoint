import { createZodDto } from 'nestjs-zod';
import { updateChecklistCategorySchema } from '@repo/types';

export class UpdateChecklistCategoryDto extends createZodDto(
  updateChecklistCategorySchema,
) {}
