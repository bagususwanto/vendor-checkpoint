import { createZodDto } from 'nestjs-zod';
import { updateMaterialCategorySchema } from '@repo/types';

export class UpdateMaterialCategoryDto extends createZodDto(
  updateMaterialCategorySchema,
) {}
