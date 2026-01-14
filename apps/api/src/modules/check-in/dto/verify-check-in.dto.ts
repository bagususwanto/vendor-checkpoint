import { createZodDto } from 'nestjs-zod';
import { verifyCheckInSchema } from '@repo/types';

export class VerifyCheckInDto extends createZodDto(verifyCheckInSchema) {}
