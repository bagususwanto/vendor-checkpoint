import { createZodDto } from 'nestjs-zod';
import { updateVendorScheduleSchema } from '@repo/types';

export class UpdateVendorScheduleDto extends createZodDto(updateVendorScheduleSchema) {}
