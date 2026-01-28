import {
  PaginatedResponse,
  SystemConfigResponse,
  FindSystemConfigParams,
  UpdateSystemConfig,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const systemConfigService = {
  getAll: async (params: FindSystemConfigParams) => {
    const response = await axiosInstance.get<
      PaginatedResponse<SystemConfigResponse>
    >('/system-config', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<{
      data: SystemConfigResponse;
    }>(`/system-config/${id}`);
    return response.data.data;
  },

  getByKey: async (key: string) => {
    const response = await axiosInstance.get<{
      data: SystemConfigResponse;
    }>(`/system-config/key/${key}`);
    return response.data.data;
  },

  update: async (id: number, data: UpdateSystemConfig) => {
    const response = await axiosInstance.patch<{
      data: SystemConfigResponse;
    }>(`/system-config/${id}`, data);
    return response.data.data;
  },
};
