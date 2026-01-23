import { createZodDto } from 'nestjs-zod';
import { createMaterialCategorySchema } from '@repo/types';

export class CreateMaterialCategoryDto extends createZodDto(
  createMaterialCategorySchema,
) {}
