import { axiosInstance } from '@/lib/axios';

export interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
}

export interface DashboardStats {
  date: string;
  total_checkins: number;
  total_approved: number;
  total_rejected: number;
  avg_lead_time_minutes: number;
  current_waiting: number;
  approval_rate: string;
  rejected_rate: string;
  trends: {
    total_checkins: TrendData;
    total_approved: TrendData;
    total_rejected: TrendData;
    avg_lead_time: TrendData;
  };
}

export interface HourlyLeadTime {
  hour: string;
  lead_time: number;
}

export interface HourlyCompliance {
  hour: string;
  compliance_rate: number;
  total_entries: number;
}

export interface ChecklistBreakdown {
  id: number;
  name: string;
  color: string;
  icon_name?: string | null;
  total_items: number;
  compliant_items: number;
  compliance_rate: number;
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

  getHourlyLeadTime: async () => {
    try {
      const response = await axiosInstance.get<{ data: HourlyLeadTime[] }>(
        '/dashboard/hourly-lead-time',
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getHourlyCompliance: async () => {
    try {
      const response = await axiosInstance.get<{ data: HourlyCompliance[] }>(
        '/dashboard/hourly-compliance',
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getChecklistBreakdown: async () => {
    try {
      const response = await axiosInstance.get<{ data: ChecklistBreakdown[] }>(
        '/dashboard/checklist-breakdown',
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
