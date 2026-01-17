import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginType } from '@repo/types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginType) => authService.login(credentials),
  });
};

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getProfile,
    retry: false,
  });

  return {
    user: data,
    isLoading,
  };
};
