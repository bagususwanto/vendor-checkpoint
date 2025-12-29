import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginType } from '@repo/types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginType) => authService.login(credentials),
  });
};
