import { axiosInstance } from '@/lib/axios';
import { ChecklistCategoryData } from '@/stores/use-checklist.store';

export const checklistService = {
  getChecklistByCategory: async (vendorCategoryId: number) => {
    try {
      const response = await axiosInstance.get<{ data: ChecklistCategoryData[] }>(
        `/checklist/by-category/${vendorCategoryId}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
