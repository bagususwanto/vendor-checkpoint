import { z } from 'zod';

export type User = {
  user_id: number;
  external_user_id: number;
  username: string;
  full_name: string;
  role: string;
  last_login?: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
