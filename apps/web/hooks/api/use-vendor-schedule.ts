import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorScheduleService } from '@/services/vendor-schedule.service';
import {
  FindVendorScheduleParams,
  CreateVendorSchedule,
  UpdateVendorSchedule,
} from '@repo/types';

export const useVendorSchedules = (params: FindVendorScheduleParams) => {
  return useQuery({
    queryKey: ['vendor-schedules', params],
    queryFn: () => vendorScheduleService.getAll(params),
  });
};

export const useVendorSchedule = (id: number) => {
  return useQuery({
    queryKey: ['vendor-schedule', id],
    queryFn: () => vendorScheduleService.getById(id),
    enabled: !!id,
  });
};

export const useCreateVendorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVendorSchedule) => vendorScheduleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-schedules'] });
    },
  });
};

export const useUpdateVendorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVendorSchedule }) =>
      vendorScheduleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-schedule'] });
    },
  });
};

export const useDeleteVendorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorScheduleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-schedules'] });
    },
  });
};
