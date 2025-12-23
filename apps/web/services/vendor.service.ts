import { PaginatedResponse, findVendorResponse, FindVendorParams } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const vendorService = {
  getVendors: async (params: FindVendorParams) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<findVendorResponse>>(
        '/vendor',
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
