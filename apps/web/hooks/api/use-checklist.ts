import { useQuery } from '@tanstack/react-query';
import { checklistService } from '@/services/checklist.service';

export function useChecklistByCategory(categoryId: number | null) {
  return useQuery({
    queryKey: ['checklist', categoryId],
    queryFn: () => checklistService.getChecklistByCategory(categoryId!),
    enabled: !!categoryId,
  });
}
