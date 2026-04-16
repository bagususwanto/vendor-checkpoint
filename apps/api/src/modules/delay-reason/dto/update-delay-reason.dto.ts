import { createZodDto } from 'nestjs-zod';
import { updateDelayReasonSchema } from '@repo/types';

export class UpdateDelayReasonDto extends createZodDto(updateDelayReasonSchema) {}
