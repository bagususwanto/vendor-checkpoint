import { createZodDto } from 'nestjs-zod';
import { submitDiscrepancySchema } from '@repo/types';

export class SubmitDiscrepancyDto extends createZodDto(submitDiscrepancySchema) {}
