import { PaginatedResponse } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export type MaterialCategory = {
  material_category_id: number;
  category_name: string;
  description?: string;
};

export type FindMaterialParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const materialCategoryService = {
  getMaterialCategories: async (params: FindMaterialParams) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<MaterialCategory>>(
        '/material-category',
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
