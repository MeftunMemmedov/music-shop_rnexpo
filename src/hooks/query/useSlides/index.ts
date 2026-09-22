import { getDataList } from '@/api/helpers';
import { Slide } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useSlides = () => {
  return useQuery({
    queryKey: ['slides'],
    queryFn: () => getDataList<Slide>('shop_slides', { select: '*' }),
  });
};

export default useSlides;
