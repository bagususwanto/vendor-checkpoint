import { axiosInstance } from '@/lib/axios';

export const schedulerService = {
  triggerSlotGenerator: async () => {
    const response = await axiosInstance.post<{ message: string }>('/scheduler/trigger-slot-generator');
    return response.data;
  },
};
