import { createZodDto } from 'nestjs-zod';
import { updateSystemConfigSchema } from '@repo/types';

export class UpdateSystemConfigDto extends createZodDto(
  updateSystemConfigSchema,
) {}
