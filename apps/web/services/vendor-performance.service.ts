import { axiosInstance } from '@/lib/axios';
import { VendorPerformanceFilter, PaginatedResponse } from '@repo/types';

export interface VendorRankingData {
  vendor_id: number;
  company_name: string;
  category_name: string;
  total_checkins: number;
  on_time_arrival_rate: number;
  on_time_departure_rate: number;
  compliance_rate: number;
  avg_lead_time: number;
  missed_cycles: number;
}

export interface VendorTrendData {
  label: string;
  total_checkins: number;
  on_time_arrival_pct: number;
  on_time_departure_pct: number;
  compliance_rate: number;
  avg_lead_time: number;
}

export interface VendorDetailData {
  vendor_id: number;
  company_name: string;
  category_name: string;
  stats: {
    total_checkins: number;
    on_time_arrival_rate: number;
    on_time_departure_rate: number;
    compliance_rate: number;
    avg_lead_time: number;
    missed_cycles: number;
  };
}

export const vendorPerformanceService = {
  getRanking: async (params: VendorPerformanceFilter) => {
    const response = await axiosInstance.get<PaginatedResponse<VendorRankingData>>(
      '/vendor-performance/ranking',
      { params },
    );
    return response.data;
  },

  getTrend: async (params: VendorPerformanceFilter) => {
    const response = await axiosInstance.get<{ data: VendorTrendData[] }>(
      '/vendor-performance/trend',
      { params },
    );
    return response.data.data;
  },

  getVendorDetail: async (vendorId: number, params: VendorPerformanceFilter) => {
    const response = await axiosInstance.get<{ data: VendorDetailData }>(
      `/vendor-performance/detail/${vendorId}`,
      { params },
    );
    return response.data.data;
  },
};
