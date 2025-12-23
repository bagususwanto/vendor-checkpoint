import { CheckIn } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const checkInService = {
  submitCheckIn: async (payload: CheckIn) => {
    try {
      const response = await axiosInstance.post<{ data: any }>('/check-in', payload);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
