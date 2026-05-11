import { axiosInstance } from '@/lib/axios';
import { 
  VendorPerformanceFilter, 
  PaginatedResponse, 
  CreateAdjustmentPayload,
  PerformanceAdjustment,
  AdjustmentFilter
} from '@repo/types';

export interface VendorRankingData {
  vendor_id: number;
  vendor_code: string;
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
  vendor_code: string;
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
  entries: {
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
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

  createAdjustment: async (payload: CreateAdjustmentPayload) => {
    const response = await axiosInstance.post<PerformanceAdjustment>(
      '/performance-adjustment',
      payload,
    );
    return response.data;
  },

  getAdjustments: async (params: AdjustmentFilter) => {
    const response = await axiosInstance.get<PaginatedResponse<PerformanceAdjustment>>(
      '/performance-adjustment',
      { params },
    );
    return response.data;
  },

  getAdjustmentByEntryId: async (entryId: number) => {
    const response = await axiosInstance.get<PerformanceAdjustment | null>(
      `/performance-adjustment/entry/${entryId}`,
    );
    return response.data;
  },

  deleteAdjustment: async (id: number) => {
    await axiosInstance.delete(`/performance-adjustment/${id}`);
  },
};
