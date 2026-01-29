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
      const response = await axiosInstance.get<{ data: ReportPreviewData }>(
        '/reports',
        {
          params,
        },
      );
      return response.data.data;
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

      let filename = `report_${new Date().getTime()}.xlsx`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const matches = /filename="?([^"]*)"?/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      return {
        data: response.data,
        filename,
      };
    } catch (error: any) {
      // Handle blob error response
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();

        let errorMessage = 'Gagal export report';

        try {
          const errorData = JSON.parse(text);

          // NestJS error response structure: { message, error, statusCode }
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Use default error message
        }

        // Throw the error message outside the try-catch
        throw new Error(errorMessage);
      }

      // For non-blob errors, throw as is
      throw error;
    }
  },
};
