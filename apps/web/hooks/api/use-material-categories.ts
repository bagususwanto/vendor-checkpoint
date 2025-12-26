import { useInfiniteQuery } from '@tanstack/react-query';
import { materialCategoryService, FindMaterialParams } from '@/services/material-category.service';

export function useMaterialCategories(params: Omit<FindMaterialParams, 'page' | 'limit'>) {
  return useInfiniteQuery({
    queryKey: ['material-categories', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await materialCategoryService.getMaterialCategories({
        ...params,
        page: pageParam,
        limit: 10,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage.meta;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
