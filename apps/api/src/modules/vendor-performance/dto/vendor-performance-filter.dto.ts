import { createZodDto } from 'nestjs-zod';
import { vendorPerformanceFilterSchema } from '@repo/types';

export class VendorPerformanceFilterDto extends createZodDto(vendorPerformanceFilterSchema) {}
