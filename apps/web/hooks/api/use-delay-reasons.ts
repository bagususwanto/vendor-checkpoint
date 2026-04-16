import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

export type DelayReason = {
  delay_reason_id: number;
  category: string;
  reason_text: string;
  is_active: boolean;
};

export const fetchDelayReasons = async (
  category?: 'Arrival' | 'Departure',
  isActive?: boolean,
) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (isActive !== undefined) params.append('isActive', isActive.toString());

  const response = await axiosInstance.get<{ data: DelayReason[] }>('/delay-reasons', {
    params,
  });
  return response.data;
};

export const useDelayReasons = (category?: 'Arrival' | 'Departure', isActive?: boolean) => {
  return useQuery({
    queryKey: ['delay-reasons', category, isActive],
    queryFn: () => fetchDelayReasons(category, isActive),
  });
};
