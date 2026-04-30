import { CheckIn, PaginatedResponse, ArrivalCheckResponse } from '@repo/types';
import { axiosInstance } from '@/lib/axios';

export const checkInService = {
  getArrivalCheck: async (vendorId: number) => {
    try {
      const response = await axiosInstance.get<{ data: ArrivalCheckResponse }>(
        `/check-in/arrival-check/${vendorId}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getDepartureCheck: async (queueNumber: string) => {
    try {
      // Re-use ArrivalCheckResponse for now or use any since they return similar fields
      const response = await axiosInstance.get<{ data: any }>(
        `/check-in/departure-check/${queueNumber}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  submitCheckIn: async (payload: CheckIn) => {
    try {
      const response = await axiosInstance.post<{ data: any }>(
        '/check-in',
        payload,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getQueueStatus: async (queueNumber: string) => {
    try {
      const response = await axiosInstance.get<{ data: any }>(
        `/check-in/queue/${queueNumber}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getActiveQueues: async (params: { page: number; limit: number }) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<any>>(
        '/check-in/active',
        { params },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVerificationList: async (params: {
    page: number;
    limit: number;
    search?: string;
    filter?: {
      start_date?: string;
      end_date?: string;
      vendor_category_id?: string;
      status?: string;
    };
  }) => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<any>>(
        '/check-in/verification-list',
        { params },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVerificationDetail: async (queueNumber: string) => {
    try {
      const response = await axiosInstance.get<{ data: any }>(
        `/check-in/verification-list/${queueNumber}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  verifyCheckIn: async (payload: {
    queue_number: string;
    action: 'APPROVE' | 'REJECT';
    rejection_reason?: string;
  }) => {
    try {
      const response = await axiosInstance.patch<{ data: any }>(
        '/check-in/verify',
        payload,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  checkoutCheckIn: async (payload: { queue_number: string; departure_status?: string; delay_departure_reason_id?: number; }) => {
    try {
      const response = await axiosInstance.patch<{ data: any }>(
        '/check-in/checkout',
        payload,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  holdCheckIn: async (payload: { queue_number: string; reason: string }) => {
    try {
      const response = await axiosInstance.patch<{ data: any }>(
        '/check-in/hold',
        payload,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  resumeCheckIn: async (queueNumber: string) => {
    try {
      const response = await axiosInstance.patch<{ data: any }>(
        '/check-in/resume',
        { queue_number: queueNumber },
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  getUnscheduledMonitor: async () => {
    try {
      const response = await axiosInstance.get<{ data: any[] }>(
        '/check-in/monitor/unscheduled',
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  uploadPpeImage: async (
    imageDataUrl: string,
  ): Promise<{ image_path: string }> => {
    const res = await fetch(imageDataUrl);
    const blob = await res.blob();

    const formData = new FormData();
    formData.append('file', blob, 'ppe-scan.jpg');

    const response = await axiosInstance.post<{
      data: { image_path: string };
    }>('/check-in/ppe-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
