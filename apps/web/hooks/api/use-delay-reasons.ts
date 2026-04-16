import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { delayReasonService, DelayReasonQuery } from '@/services/delay-reason.service';
import {
  CreateDelayReason,
  UpdateDelayReason,
} from '@repo/types';

export const useDelayReasons = (params: DelayReasonQuery) => {
  return useQuery({
    queryKey: ['delay-reasons', params],
    queryFn: () => delayReasonService.getAll(params),
  });
};

export const useDelayReason = (id: number) => {
  return useQuery({
    queryKey: ['delay-reason', id],
    queryFn: () => delayReasonService.getById(id),
    enabled: !!id,
  });
};

export const useCreateDelayReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDelayReason) => delayReasonService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delay-reasons'] });
    },
  });
};

export const useUpdateDelayReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDelayReason }) =>
      delayReasonService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delay-reasons'] });
      queryClient.invalidateQueries({ queryKey: ['delay-reason'] });
    },
  });
};

export const useDeleteDelayReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => delayReasonService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delay-reasons'] });
    },
  });
};
