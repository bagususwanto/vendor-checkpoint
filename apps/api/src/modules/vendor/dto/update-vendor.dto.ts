import { createZodDto } from 'nestjs-zod';
import { updateVendorSchema } from '@repo/types';

export class UpdateVendorDto extends createZodDto(updateVendorSchema) {}
