import {
  VendorScheduleResponse,
  FindVendorScheduleParams,
  CreateVendorSchedule,
  UpdateVendorSchedule,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const vendorScheduleService = {
  getAll: async (params: FindVendorScheduleParams) => {
    const response = await axiosInstance.get<{ data: VendorScheduleResponse[] }>('/vendor-schedules', { params });
    // Note: The NestJS standard is if not explicitly wrapped, sometimes it returns array directly.
    return Array.isArray(response.data) ? response.data : response.data.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<{ data: VendorScheduleResponse }>(`/vendor-schedules/${id}`);
    return response.data.data ?? response.data;
  },

  create: async (data: CreateVendorSchedule) => {
    const response = await axiosInstance.post<{ data: VendorScheduleResponse }>('/vendor-schedules', data);
    return response.data.data ?? response.data;
  },

  update: async (id: number, data: UpdateVendorSchedule) => {
    const response = await axiosInstance.patch<{ data: VendorScheduleResponse }>(`/vendor-schedules/${id}`, data);
    return response.data.data ?? response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<{ data: VendorScheduleResponse }>(`/vendor-schedules/${id}`);
    return response.data.data ?? response.data;
  },
};
