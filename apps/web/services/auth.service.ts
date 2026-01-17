import { axiosInstance } from '@/lib/axios';
import { LoginType, LoginResponse } from '@repo/types';

export const authService = {
  login: async (credentials: LoginType): Promise<LoginResponse> => {
    const response = await axiosInstance.post<{ data: LoginResponse }>(
      '/auth/login',
      credentials,
    );
    const { accessToken } = response.data.data;

    // Store access token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }

    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      const accessToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;

      if (accessToken) {
        await axiosInstance.post('/auth/logout', { accessToken });
      }
    } finally {
      // Always clear local token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },

  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  getProfile: async (): Promise<any> => {
    const response = await axiosInstance.get('/auth/me');
    console.log(response);
    return response.data.data;
  },
};
