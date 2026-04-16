import {
  DelayReasonResponse,
  FindDelayReasonParams,
  CreateDelayReason,
  UpdateDelayReason,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const delayReasonService = {
  getAll: async (params: FindDelayReasonParams) => {
    // Note: The NestJS standard used here is returning the array directly or in a `data` property.
    // Based on previous inspection, it might be { data: DelayReason[] } or DelayReason[]
    const response = await axiosInstance.get('/delay-reasons', { params });
    return Array.isArray(response.data) ? response.data : response.data.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<{ data: DelayReasonResponse }>(`/delay-reasons/${id}`);
    return response.data.data ?? response.data;
  },

  create: async (data: CreateDelayReason) => {
    const response = await axiosInstance.post<{ data: DelayReasonResponse }>('/delay-reasons', data);
    return response.data.data ?? response.data;
  },

  update: async (id: number, data: UpdateDelayReason) => {
    const response = await axiosInstance.patch<{ data: DelayReasonResponse }>(`/delay-reasons/${id}`, data);
    return response.data.data ?? response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<{ data: DelayReasonResponse }>(`/delay-reasons/${id}`);
    return response.data.data ?? response.data;
  },
};
