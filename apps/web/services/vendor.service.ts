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
    // Start background sync
    await axiosInstance.post('/vendor/sync');

    // Poll status until complete
    return vendorService.pollSyncStatus();
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
    }>('/vendor/sync/status');
    return response.data.data;
  },

  pollSyncStatus: async (maxAttempts = 300, intervalMs = 500) => {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await vendorService.getSyncStatus();

      if (!status.inProgress) {
        // Sync completed
        if (status.error) {
          throw new Error(status.error);
        }
        return {
          created: status.created,
          updated: status.updated,
          total: status.total,
        };
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      attempts++;
    }

    throw new Error('Sync timeout after 2.5 minutes');
  },
};
