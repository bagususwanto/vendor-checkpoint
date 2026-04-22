import { createZodDto } from 'nestjs-zod';
import { arrivalCheckResponseSchema } from '@repo/types';

export class ArrivalCheckResponseDto extends createZodDto(arrivalCheckResponseSchema) {}
