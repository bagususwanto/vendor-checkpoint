import { CheckIn, PaginatedResponse } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const checkInService = {
  submitCheckIn: async (payload: CheckIn) => {
    try {
      const response = await axiosInstance.post<{ data: any }>(
        '/check-in',
        payload,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getQueueStatus: async (queueNumber: string) => {
    try {
      const response = await axiosInstance.get<{ data: any }>(
        `/check-in/queue/${queueNumber}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getActiveQueues: async (params: { page: number; limit: number }) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<any>>(
        '/check-in/active',
        { params },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVerificationList: async (params: {
    page: number;
    limit: number;
    search?: string;
    filter?: {
      start_date?: string;
      end_date?: string;
      material_category_id?: string;
      status?: string;
    };
  }) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<any>>(
        '/check-in/verification-list',
        { params },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
