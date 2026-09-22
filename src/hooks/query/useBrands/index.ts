import { getDataList } from '@/api/helpers';
import { Brand } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => getDataList<Brand>('shop_brands', { select: '*' }),
  });
};

export default useBrands;
