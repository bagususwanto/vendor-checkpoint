import { axiosInstance } from '@/lib/axios';

export interface DashboardStats {
  date: string;
  total_checkins: number;
  total_approved: number;
  total_rejected: number;
  avg_lead_time_minutes: number;
  current_waiting: number;
  approval_rate: string;
  rejected_rate: string;
}

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await axiosInstance.get<{ data: DashboardStats }>(
        '/dashboard/stats',
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
