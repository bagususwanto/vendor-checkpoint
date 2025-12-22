import { createZodDto } from 'nestjs-zod';
import { findVendorParamsSchema } from '@repo/types';

export class FindVendorParamsDto extends createZodDto(findVendorParamsSchema) {}
