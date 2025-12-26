import { createZodDto } from 'nestjs-zod';
import { paginatedParamsSchema } from '@repo/types';

export class PaginatedParamsDto extends createZodDto(paginatedParamsSchema) {}
