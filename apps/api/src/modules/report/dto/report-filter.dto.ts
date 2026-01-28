import { createZodDto } from 'nestjs-zod';
import { reportFilterSchema } from '@repo/types';

export class ReportFilterDto extends createZodDto(reportFilterSchema) {}
