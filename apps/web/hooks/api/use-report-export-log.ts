import { useQuery } from '@tanstack/react-query';
import {
  reportExportLogService,
  ReportExportLogFilter,
} from '@/services/report-export-log.service';

export const useReportExportLogs = (filter: ReportExportLogFilter) => {
  return useQuery({
    queryKey: ['report-export-logs', filter],
    queryFn: () => reportExportLogService.getExportLogs(filter),
    enabled: !!filter.dateFrom && !!filter.dateTo,
  });
};
