import { createZodDto } from 'nestjs-zod';
import { holdCheckInSchema } from '@repo/types';

export class HoldCheckInDto extends createZodDto(holdCheckInSchema) {}
