import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginType = z.infer<typeof loginSchema>;

export interface JwtPayload {
  userId: string;
  username: string;
  name: string;
  roleName: string;
  img?: string | null;
  iat?: number;
  exp?: number;
}
