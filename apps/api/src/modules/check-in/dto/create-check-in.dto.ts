import { createZodDto } from 'nestjs-zod';
import { checkInSchema } from '@repo/types';

export class CreateCheckInDto extends createZodDto(checkInSchema) {}
