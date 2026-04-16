import { createZodDto } from 'nestjs-zod';
import { createVendorCategorySchema } from '@repo/types';

export class CreateMaterialCategoryDto extends createZodDto(
  createVendorCategorySchema,
) {}
