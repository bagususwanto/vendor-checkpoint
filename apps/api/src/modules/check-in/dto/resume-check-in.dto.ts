import { createZodDto } from 'nestjs-zod';
import { resumeCheckInSchema } from '@repo/types';

export class ResumeCheckInDto extends createZodDto(resumeCheckInSchema) {}
