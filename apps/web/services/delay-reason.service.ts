import {
  PaginatedResponse,
  DelayReasonResponse,
  FindDelayReasonParams,
  CreateDelayReason,
  UpdateDelayReason,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export type DelayReasonQuery = FindDelayReasonParams & {
  page?: number;
  limit?: number;
  search?: string;
};

export const delayReasonService = {
  getAll: async (params: DelayReasonQuery): Promise<PaginatedResponse<DelayReasonResponse>> => {
    const response = await axiosInstance.get<PaginatedResponse<DelayReasonResponse>>(
      '/delay-reasons',
      { params },
    );
    return response.data;
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
