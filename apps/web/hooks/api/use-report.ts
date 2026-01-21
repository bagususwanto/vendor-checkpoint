import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService, ReportFilter } from '@/services/report.service';

export const useReportPreview = (filter: ReportFilter) => {
  return useQuery({
    queryKey: ['report-preview', filter],
    queryFn: () => reportService.getPreview(filter),
    enabled: !!filter.dateFrom && !!filter.dateTo,
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: (filter: ReportFilter) => reportService.exportExcel(filter),
    onSuccess: (data: Blob) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
};
