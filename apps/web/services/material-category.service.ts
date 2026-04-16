import {
  PaginatedResponse,
  VendorCategoryResponse,
  FindVendorCategoryParams,
  CreateVendorCategory,
  UpdateVendorCategory,
  BulkDeleteVendorCategory,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const materialCategoryService = {
  getAll: async (params: FindVendorCategoryParams) => {
    const response = await axiosInstance.get<
      PaginatedResponse<VendorCategoryResponse>
    >('/vendor-categories', { params });
    return response.data;
  },

  getSelection: async () => {
    const response = await axiosInstance.get<{
      data: VendorCategoryResponse[];
    }>('/vendor-categories/selection');
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<{
      data: VendorCategoryResponse;
    }>(`/vendor-categories/${id}`);
    return response.data.data;
  },

  create: async (data: CreateVendorCategory) => {
    const response = await axiosInstance.post<{
      data: VendorCategoryResponse;
    }>('/vendor-categories', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateVendorCategory) => {
    const response = await axiosInstance.patch<{
      data: VendorCategoryResponse;
    }>(`/vendor-categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<{
      data: VendorCategoryResponse;
    }>(`/vendor-categories/${id}`);
    return response.data.data;
  },

  bulkDelete: async (data: BulkDeleteVendorCategory) => {
    const response = await axiosInstance.delete<{ data: { count: number } }>(
      '/vendor-categories',
      { data },
    );
    return response.data.data;
  },

  toggleStatus: async (id: number) => {
    const response = await axiosInstance.patch<{
      data: VendorCategoryResponse;
    }>(`/vendor-categories/${id}/toggle-status`);
    return response.data.data;
  },
};
