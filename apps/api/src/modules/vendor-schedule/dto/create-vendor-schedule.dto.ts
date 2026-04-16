import { createZodDto } from 'nestjs-zod';
import { createVendorScheduleSchema } from '@repo/types';

export class CreateVendorScheduleDto extends createZodDto(createVendorScheduleSchema) {}
