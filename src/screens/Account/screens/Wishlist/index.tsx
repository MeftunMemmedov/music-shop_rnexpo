import EmptyScreen from '@/components/EmptyScreen';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ProductList from '@/components/ProductList';
import { useWishlist } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import NetInfo from '@react-native-community/netinfo';
import { useState } from 'react';

const Wishlist = () => {
  const { isAuth } = useAppSelector((store) => store.user);
  const { items, isLoading, error, refetch } = useWishlist();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    if (!isAuth) return;

    const netState = await NetInfo.fetch();

    if (!netState.isConnected) return;

    try {
      setIsRefreshing(true);
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen refresh={onRefresh} />;

  const wishlistITems = items.map((wlItem) => wlItem.product);
  return (
    <ProductList
      ListEmptyComponent={<EmptyScreen message="Wishlist is empty" />}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      data={wishlistITems}
      keyTitle={'wishlist-item'}
      className="flex-1"
      isWishlistScreen
    />
  );
};

export default Wishlist;
