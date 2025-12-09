import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '@repo/types';

export class LoginDto extends createZodDto(loginSchema) {}
