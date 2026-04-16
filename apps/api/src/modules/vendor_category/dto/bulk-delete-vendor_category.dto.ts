import { createZodDto } from 'nestjs-zod';
import { bulkDeleteVendorCategorySchema } from '@repo/types';

export class BulkDeleteVendorCategoryDto extends createZodDto(
  bulkDeleteVendorCategorySchema,
) {}
