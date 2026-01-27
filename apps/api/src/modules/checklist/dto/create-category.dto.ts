import { createZodDto } from 'nestjs-zod';
import { createChecklistCategorySchema } from '@repo/types';

export class CreateChecklistCategoryDto extends createZodDto(
  createChecklistCategorySchema,
) {}
