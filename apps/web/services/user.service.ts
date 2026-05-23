import { SyncResult } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const userService = {
  syncUsers: async () => {
    await axiosInstance.post('/user/sync');
    return userService.pollSyncStatus();
  },

  getSyncStatus: async () => {
    const response = await axiosInstance.get<{
      data: {
        inProgress: boolean;
        created: number;
        updated: number;
        total: number;
        syncTime?: string;
        completedAt?: string;
        error?: string;
      };
    }>('/user/sync/status');
    return response.data.data;
  },

  pollSyncStatus: async (maxAttempts = 300, intervalMs = 500) => {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await userService.getSyncStatus();

      if (!status.inProgress) {
        if (status.error) {
          throw new Error(status.error);
        }

        return {
          created: status.created,
          updated: status.updated,
          total: status.total,
        } as SyncResult['data'];
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      attempts += 1;
    }

    throw new Error('Sync timeout after 2.5 minutes');
  },
};
