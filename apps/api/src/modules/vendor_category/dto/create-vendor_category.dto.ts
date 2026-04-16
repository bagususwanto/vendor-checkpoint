import { createZodDto } from 'nestjs-zod';
import { createVendorCategorySchema } from '@repo/types';

export class CreateVendorCategoryDto extends createZodDto(
  createVendorCategorySchema,
) {}
