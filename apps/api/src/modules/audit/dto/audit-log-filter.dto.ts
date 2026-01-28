import { createZodDto } from 'nestjs-zod';
import { auditLogFilterSchema } from '@repo/types';

export class AuditLogFilterDto extends createZodDto(auditLogFilterSchema) {}
