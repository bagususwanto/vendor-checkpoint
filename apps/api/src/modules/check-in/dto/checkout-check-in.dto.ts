import { createZodDto } from 'nestjs-zod';
import { checkoutSchema } from '@repo/types';

export class CheckoutCheckInDto extends createZodDto(checkoutSchema) {}
