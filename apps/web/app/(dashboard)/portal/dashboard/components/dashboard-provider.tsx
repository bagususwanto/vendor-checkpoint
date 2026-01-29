'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSystemConfigByKey } from '@/hooks/api/use-system-config';

interface DashboardConfigContextType {
  refreshInterval: number;
}

const DashboardConfigContext = createContext<DashboardConfigContextType>({
  refreshInterval: 60000, // Default 60 seconds
});

export function useDashboardConfig() {
  return useContext(DashboardConfigContext);
}

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  // Fetch refresh interval from system config
  const { data: refreshConfig } = useSystemConfigByKey('REFRESH_INTERVAL_MS');
  const refreshInterval = refreshConfig?.config_value
    ? parseInt(refreshConfig.config_value, 10)
    : 60000; // Default 60 seconds

  return (
    <DashboardConfigContext.Provider value={{ refreshInterval }}>
      {children}
    </DashboardConfigContext.Provider>
  );
}
