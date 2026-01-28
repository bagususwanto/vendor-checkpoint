import { axiosInstance } from '@/lib/axios';
import { AuditLogFilter } from '@repo/types';

export interface AuditLog {
  audit_id: number;
  entry_id?: number;
  user_id?: number;
  action_type: string;
  action_description: string;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    user_id: number;
    username: string;
    full_name: string;
  };
  entry?: {
    entry_id: number;
    queue_number: string;
  };
}

export interface AuditLogResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const auditLogService = {
  getAuditLogs: async (params: AuditLogFilter) => {
    try {
      const response = await axiosInstance.get<AuditLogResponse>(
        '/reports/audit-logs',
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportAuditLogs: async (params: AuditLogFilter) => {
    try {
      const response = await axiosInstance.get('/reports/audit-logs/export', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
