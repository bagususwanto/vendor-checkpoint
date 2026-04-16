import { createZodDto } from 'nestjs-zod';
import { updateVendorCategorySchema } from '@repo/types';

export class UpdateMaterialCategoryDto extends createZodDto(
  updateVendorCategorySchema,
) {}
