import {
  PaginatedResponse,
  MaterialCategoryResponse,
  FindMaterialCategoryParams,
  CreateMaterialCategory,
  UpdateMaterialCategory,
  BulkDeleteMaterialCategory,
} from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const materialCategoryService = {
  getAll: async (params: FindMaterialCategoryParams) => {
    const response = await axiosInstance.get<
      PaginatedResponse<MaterialCategoryResponse>
    >('/material-category', { params });
    return response.data;
  },

  getSelection: async () => {
    const response = await axiosInstance.get<{
      data: MaterialCategoryResponse[];
    }>('/material-category/selection');
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<{
      data: MaterialCategoryResponse;
    }>(`/material-category/${id}`);
    return response.data.data;
  },

  create: async (data: CreateMaterialCategory) => {
    const response = await axiosInstance.post<{
      data: MaterialCategoryResponse;
    }>('/material-category', data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateMaterialCategory) => {
    const response = await axiosInstance.patch<{
      data: MaterialCategoryResponse;
    }>(`/material-category/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<{
      data: MaterialCategoryResponse;
    }>(`/material-category/${id}`);
    return response.data.data;
  },

  bulkDelete: async (data: BulkDeleteMaterialCategory) => {
    const response = await axiosInstance.delete<{ data: { count: number } }>(
      '/material-category',
      { data },
    );
    return response.data.data;
  },

  toggleStatus: async (id: number) => {
    const response = await axiosInstance.patch<{
      data: MaterialCategoryResponse;
    }>(`/material-category/${id}/toggle-status`);
    return response.data.data;
  },
};
