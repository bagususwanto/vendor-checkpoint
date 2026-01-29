import {
  PaginatedResponse,
  findVendorResponse,
  FindVendorParams,
  SyncResult,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const vendorService = {
  getVendors: async (params: FindVendorParams) => {
    const response = await axiosInstance.get<
      PaginatedResponse<findVendorResponse>
    >('/vendor', { params });
    return response.data;
  },

  getVendorById: async (id: number) => {
    const response = await axiosInstance.get<{ data: findVendorResponse }>(
      `/vendor/${id}`,
    );
    return response.data.data;
  },

  syncVendors: async () => {
    const response = await axiosInstance.post<{ data: SyncResult['data'] }>(
      '/vendor/sync',
    );
    return response.data.data;
  },
};
