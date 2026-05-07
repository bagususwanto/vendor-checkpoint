import { createZodDto } from 'nestjs-zod';
import { adjustmentFilterSchema } from '@repo/types';

export class AdjustmentFilterDto extends createZodDto(adjustmentFilterSchema) {}
