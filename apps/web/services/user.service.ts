import { SyncResult } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const userService = {
  syncUsers: async () => {
    const response = await axiosInstance.post<{ data: SyncResult }>(
      '/user/sync',
    );
    return response.data.data;
  },
};
