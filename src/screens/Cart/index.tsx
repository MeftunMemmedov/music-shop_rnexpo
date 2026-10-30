import { Text } from '@/components/AppText';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import NoConnectionScreen from '@/components/NoConnectionScreen';
import { Divider } from '@/components/ui/divider';
import { getPriceDisplay } from '@/helpers/product';
import { getCart } from '@/store/cart/asyncThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNetInfo } from '@react-native-community/netinfo';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import CartList from './components/CartList';

const Cart = () => {
  const dispatch = useAppDispatch();

  const { isConnected } = useNetInfo();
  const { isAuth } = useAppSelector((store) => store.user);

  const {
    items,
    total,
    status: {
      init: { loading, failure },
      updating: updatingCartItems,
    },
  } = useAppSelector((store) => store.cart);

  const onRefresh = () => {
    dispatch(getCart());
  };

  if (loading) return <LoadingScreen />;
  if (isAuth && isConnected === false)
    return <NoConnectionScreen refresh={onRefresh} />;
  if (failure) return <ErrorScreen refresh={onRefresh} />;
  return (
    <View className="container relative">
      <CartList items={items} onRefresh={onRefresh} />
      {items && items.length > 0 && (
        <View className="bg-white">
          <Divider className="mb-6" />
          <View className="flex-row mb-5">
            <Text className="w-1/2 text-xl font-semibold">Total</Text>
            <Text className="w-1/2 text-right text-xl font-semibold">
              {getPriceDisplay(total)}
            </Text>
          </View>
          <Link
            href={isAuth ? '/checkout/form' : '/auth/signin'}
            asChild
            disabled={loading || updatingCartItems !== null}
          >
            <Pressable className="w-11/12 bg-charcoal py-4 m-auto rounded-full">
              <Text className="text-center text-white text-xl font-medium">
                Proceed to checkout
              </Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
};

export default Cart;
