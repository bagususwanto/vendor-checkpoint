import { createZodDto } from 'nestjs-zod';
import { bulkDeleteMaterialCategorySchema } from '@repo/types';

export class BulkDeleteMaterialCategoryDto extends createZodDto(
  bulkDeleteMaterialCategorySchema,
) {}
