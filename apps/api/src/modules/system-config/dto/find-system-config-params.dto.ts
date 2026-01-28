import { createZodDto } from 'nestjs-zod';
import { findSystemConfigParamsSchema } from '@repo/types';

export class FindSystemConfigParamsDto extends createZodDto(
  findSystemConfigParamsSchema,
) {}
