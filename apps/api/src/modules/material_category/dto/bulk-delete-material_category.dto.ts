import { createZodDto } from 'nestjs-zod';
import { bulkDeleteVendorCategorySchema } from '@repo/types';

export class BulkDeleteMaterialCategoryDto extends createZodDto(
  bulkDeleteVendorCategorySchema,
) {}
