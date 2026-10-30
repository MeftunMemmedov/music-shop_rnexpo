import { getDataList } from '@/api/helpers';
import { Notification } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useNotifications = (isAuth: boolean) => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      getDataList<Notification>('shop_notifications', { select: '*' }),
    enabled: isAuth,
  });
};

export default useNotifications;
