import { CheckIn } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const checkInService = {
  submitCheckIn: async (payload: CheckIn) => {
    try {
      const response = await axiosInstance.post('/check-in', payload);
      return response.data;
    } catch (error) {
      // Re-throw to be handled by the component
      throw error;
    }
  },
};
