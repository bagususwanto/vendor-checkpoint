import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { vendorScheduleService, VendorScheduleQuery } from '@/services/vendor-schedule.service';
import {
  CreateVendorSchedule,
  UpdateVendorSchedule,
} from '@repo/types';

export const useVendorSchedules = (params: VendorScheduleQuery) => {
  return useQuery({
    queryKey: ['vendor-schedules', params],
    queryFn: () => vendorScheduleService.getAll(params),
    placeholderData: keepPreviousData,
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

export const useDownloadVendorScheduleTemplate = () => {
  return useMutation({
    mutationFn: () => vendorScheduleService.downloadTemplate(),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_jadwal_vendor.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};

export const useUploadVendorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => vendorScheduleService.uploadExcel(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-schedules'] });
    },
  });
};

export const useExportVendorSchedule = () => {
  return useMutation({
    mutationFn: (params: VendorScheduleQuery) => vendorScheduleService.exportData(params),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_jadwal_vendor.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};


