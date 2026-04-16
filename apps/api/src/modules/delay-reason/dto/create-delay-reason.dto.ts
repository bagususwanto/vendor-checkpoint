import { createZodDto } from 'nestjs-zod';
import { createDelayReasonSchema } from '@repo/types';

export class CreateDelayReasonDto extends createZodDto(createDelayReasonSchema) {}
