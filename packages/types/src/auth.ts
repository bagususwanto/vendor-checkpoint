import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginType = z.infer<typeof loginSchema>;

export interface JwtPayload {
  userId: number;
  username: string;
  name: string;
  isProduction: number;
  isWarehouse: number;
  roleName: string;
  anotherWarehouseId: number;
  img: string | null;
  plantId: number;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  accessToken: string;
}
