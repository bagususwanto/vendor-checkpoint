import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useDashboardStats(refetchInterval?: number) {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: refetchInterval ?? 60000, // Default 60 seconds if not provided
  });
}

export function useHourlyLeadTime(refetchInterval?: number) {
  return useQuery({
    queryKey: ['dashboard-hourly-lead-time'],
    queryFn: () => dashboardService.getHourlyLeadTime(),
    refetchInterval: refetchInterval ?? 60000, // Default 60 seconds if not provided
  });
}

export function useHourlyCompliance(refetchInterval?: number) {
  return useQuery({
    queryKey: ['dashboard-hourly-compliance'],
    queryFn: () => dashboardService.getHourlyCompliance(),
    refetchInterval: refetchInterval ?? 60000, // Default 60 seconds if not provided
  });
}

export function useChecklistBreakdown(refetchInterval?: number) {
  return useQuery({
    queryKey: ['dashboard-checklist-breakdown'],
    queryFn: () => dashboardService.getChecklistBreakdown(),
    refetchInterval: refetchInterval ?? 60000, // Default 60 seconds if not provided
  });
}
