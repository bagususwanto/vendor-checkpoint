import { createZodDto } from 'nestjs-zod';
import { reorderSchema } from '@repo/types';

export class ReorderDto extends createZodDto(reorderSchema) {}
