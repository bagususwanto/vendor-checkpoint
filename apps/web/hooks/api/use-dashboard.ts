import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 60000, // Refresh every 60 seconds
  });
}

export function useHourlyLeadTime() {
  return useQuery({
    queryKey: ['dashboard-hourly-lead-time'],
    queryFn: () => dashboardService.getHourlyLeadTime(),
    refetchInterval: 60000, // Refresh every 60 seconds
  });
}

export function useHourlyCompliance() {
  return useQuery({
    queryKey: ['dashboard-hourly-compliance'],
    queryFn: () => dashboardService.getHourlyCompliance(),
    refetchInterval: 60000, // Refresh every 60 seconds
  });
}

export function useChecklistBreakdown() {
  return useQuery({
    queryKey: ['dashboard-checklist-breakdown'],
    queryFn: () => dashboardService.getChecklistBreakdown(),
    refetchInterval: 60000, // Refresh every 60 seconds
  });
}
