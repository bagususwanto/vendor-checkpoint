import { axiosInstance } from '@/lib/axios';

export interface ReportExportLog {
  export_id: number;
  exported_by_user_id: number;
  report_type: string;
  date_from: string;
  date_to: string;
  filter_criteria?: string;
  total_records: number;
  file_name: string;
  file_path?: string;
  export_time: string;
  user?: {
    user_id: number;
    username: string;
    full_name: string;
  };
}

export interface ReportExportLogFilter {
  dateFrom: string;
  dateTo: string;
  reportType?: string;
  page?: number;
  limit?: number;
}

export interface ReportExportLogResponse {
  data: ReportExportLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const reportExportLogService = {
  getExportLogs: async (params: ReportExportLogFilter) => {
    try {
      const response = await axiosInstance.get<ReportExportLogResponse>(
        '/reports/export-logs',
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
