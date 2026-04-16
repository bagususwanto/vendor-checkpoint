import { createZodDto } from 'nestjs-zod';
import { updateVendorCategorySchema } from '@repo/types';

export class UpdateVendorCategoryDto extends createZodDto(
  updateVendorCategorySchema,
) {}
