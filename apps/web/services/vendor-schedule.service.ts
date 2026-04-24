import {
  PaginatedResponse,
  VendorScheduleResponse,
  FindVendorScheduleParams,
  CreateVendorSchedule,
  UpdateVendorSchedule,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export type VendorScheduleQuery = FindVendorScheduleParams & {
  page?: number;
  limit?: number;
  search?: string;
};

export const vendorScheduleService = {
  getAll: async (params: VendorScheduleQuery): Promise<PaginatedResponse<VendorScheduleResponse>> => {
    const response = await axiosInstance.get<PaginatedResponse<VendorScheduleResponse>>(
      '/vendor-schedules',
      { params },
    );
    return response.data;
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

  downloadTemplate: async () => {
    const response = await axiosInstance.get('/vendor-schedules/template', {
      responseType: 'blob',
    });
    return response.data;
  },

  uploadExcel: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/vendor-schedules/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
