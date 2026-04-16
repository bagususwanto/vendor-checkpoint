import { createZodDto } from 'nestjs-zod';
import { departureScanSchema } from '@repo/types';

export class DepartureScanDto extends createZodDto(departureScanSchema) {}
