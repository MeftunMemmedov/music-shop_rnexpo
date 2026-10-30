import { getDataList } from '@/api/helpers';
import { Category } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      getDataList<Category>('shop_categories', {
        select: '*,children:shop_categories!parent_slug(*)',
        parent_slug: 'is.null',
      }),
  });
};
export default useCategories;
