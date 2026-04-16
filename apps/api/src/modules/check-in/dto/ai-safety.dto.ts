import { createZodDto } from 'nestjs-zod';
import { aiSafetySchema } from '@repo/types';

export class AiSafetyDto extends createZodDto(aiSafetySchema) {}
