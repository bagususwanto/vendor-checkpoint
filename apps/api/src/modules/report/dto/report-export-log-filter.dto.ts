import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const reportExportLogFilterSchema = z.object({
  dateFrom: z.string().date('Invalid date format (YYYY-MM-DD)'),
  dateTo: z.string().date('Invalid date format (YYYY-MM-DD)'),
  reportType: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export class ReportExportLogFilterDto extends createZodDto(
  reportExportLogFilterSchema,
) {}
