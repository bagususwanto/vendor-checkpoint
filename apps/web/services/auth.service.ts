import { axiosInstance } from '@/lib/axios';
import { LoginType, LoginResponse } from '@repo/types';

export const authService = {
  login: async (credentials: LoginType) => {
    try {
      const response = await axiosInstance.post<{ data: LoginResponse }>('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
