import { axiosInstance } from '@/lib/axios';

export interface ReportFilter {
  dateFrom: string;
  dateTo: string;
  status?: string;
  materialCategoryId?: number;
}

export interface ReportPreviewData {
  period: {
    from: string;
    to: string;
  };
  totalCheckins: number;
  complianceRate: number;
  statusBreakdown: {
    status: string;
    count: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
  }[];
  nonCompliantItems: number;
}

export const reportService = {
  getPreview: async (params: ReportFilter) => {
    try {
      const response = await axiosInstance.get<ReportPreviewData>('/reports', {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportExcel: async (params: ReportFilter) => {
    try {
      const response = await axiosInstance.get('/reports/export', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
