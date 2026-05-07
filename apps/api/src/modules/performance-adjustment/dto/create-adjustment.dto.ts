import { createZodDto } from 'nestjs-zod';
import { createAdjustmentSchema } from '@repo/types';

export class CreateAdjustmentDto extends createZodDto(createAdjustmentSchema) {}
