import { useQuery, useMutation } from '@tanstack/react-query';
import { auditLogService } from '@/services/audit-log.service';
import { AuditLogFilter } from '@repo/types';

export const useAuditLogs = (filter: AuditLogFilter) => {
  return useQuery({
    queryKey: ['audit-logs', filter],
    queryFn: () => auditLogService.getAuditLogs(filter),
    enabled: !!filter.dateFrom && !!filter.dateTo,
  });
};

export const useExportAuditLogs = () => {
  return useMutation({
    mutationFn: (filter: AuditLogFilter) =>
      auditLogService.exportAuditLogs(filter),
    onSuccess: (data: Blob) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_log_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
