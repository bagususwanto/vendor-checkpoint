import { axiosInstance } from '@/lib/axios';
import {
  ChecklistCategoryResponse,
  ChecklistItemResponse,
  CreateChecklistCategory,
  CreateChecklistItem,
  Reorder,
  UpdateChecklistCategory,
  UpdateChecklistItem,
} from '@/types/checklist';

export const checklistService = {
  // --- Category ---

  getAllCategories: async () => {
    const response = await axiosInstance.get<{
      data: ChecklistCategoryResponse[];
    }>('/checklist/categories');
    return response.data.data;
  },

  createCategory: async (data: CreateChecklistCategory) => {
    const response = await axiosInstance.post<{
      data: ChecklistCategoryResponse;
    }>('/checklist/category', data);
    return response.data.data;
  },

  updateCategory: async (id: number, data: UpdateChecklistCategory) => {
    const response = await axiosInstance.patch<{
      data: ChecklistCategoryResponse;
    }>(`/checklist/category/${id}`, data);
    return response.data.data;
  },

  deleteCategory: async (id: number) => {
    const response = await axiosInstance.delete<{
      data: ChecklistCategoryResponse;
    }>(`/checklist/category/${id}`);
    return response.data.data;
  },

  reorderCategories: async (data: Reorder) => {
    const response = await axiosInstance.post(
      '/checklist/category/reorder',
      data,
    );
    return response.data;
  },

  // --- Item ---

  createItem: async (data: CreateChecklistItem) => {
    const response = await axiosInstance.post<{
      data: ChecklistItemResponse; // Note: Ensure API returns the item
    }>('/checklist/item', data);
    return response.data;
  },

  updateItem: async (id: number, data: UpdateChecklistItem) => {
    const response = await axiosInstance.patch<{
      data: ChecklistItemResponse;
    }>(`/checklist/item/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: number) => {
    const response = await axiosInstance.delete<{
      data: ChecklistItemResponse;
    }>(`/checklist/item/${id}`);
    return response.data;
  },

  reorderItems: async (data: Reorder) => {
    const response = await axiosInstance.post('/checklist/item/reorder', data);
    return response.data;
  },

  // --- Public / Existing ---

  getChecklistByCategory: async (vendorCategoryId: number) => {
    // Note: This endpoint returns a slightly different structure based on schema
    // existing implementation usage. For now keeping as is but using new type if compatible
    // or just 'any' if it's too specific to the public portal and not master data.
    // The previous implementation inferred types from the response.
    // We'll keep the return type as Promise<ChecklistCategoryResponse[]> but
    // be aware the shape might be partial.
    try {
      const response = await axiosInstance.get<{
        data: ChecklistCategoryResponse[];
      }>(`/checklist/by-category/${vendorCategoryId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
