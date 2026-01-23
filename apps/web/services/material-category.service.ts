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
    const response = await axiosInstance.get<MaterialCategoryResponse[]>(
      '/material-category/selection',
    );
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axiosInstance.get<MaterialCategoryResponse>(
      `/material-category/${id}`,
    );
    return response.data;
  },

  create: async (data: CreateMaterialCategory) => {
    const response = await axiosInstance.post<MaterialCategoryResponse>(
      '/material-category',
      data,
    );
    return response.data;
  },

  update: async (id: number, data: UpdateMaterialCategory) => {
    const response = await axiosInstance.patch<MaterialCategoryResponse>(
      `/material-category/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosInstance.delete<MaterialCategoryResponse>(
      `/material-category/${id}`,
    );
    return response.data;
  },

  bulkDelete: async (data: BulkDeleteMaterialCategory) => {
    const response = await axiosInstance.delete<{ count: number }>(
      '/material-category',
      { data },
    );
    return response.data;
  },

  toggleStatus: async (id: number) => {
    const response = await axiosInstance.patch<MaterialCategoryResponse>(
      `/material-category/${id}/toggle-status`,
    );
    return response.data;
  },
};
