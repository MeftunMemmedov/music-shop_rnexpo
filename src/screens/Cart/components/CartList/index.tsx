import EmptyScreen from '@/components/EmptyScreen';
import { MotiPressable } from '@/components/Motified';
import { useCart } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import CartProductItem from './components/CartProductItem';

interface Props {
  items: CartItem[] | null;
  onRefresh: () => void;
}

const CartList = ({ items, onRefresh }: Props) => {
  const { info } = useAppSelector((store) => store.user);

  const { loading } = useAppSelector((store) => store.cart.status.init);

  const { handleDeleteMultipleCartItems } = useCart();

  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>([]);

  const handleDeleteSelectedCartItems = async () => {
    if (selectedCartItemIds.length === 0) return;

    await handleDeleteMultipleCartItems(
      selectedCartItemIds,
      info?.user_id || '',
    );
    setSelectedCartItemIds([]);
  };

  return (
    <View className="relative">
      <MotiPressable
        animate={{
          translateX: selectedCartItemIds.length > 0 ? 0 : 500,
        }}
        onPress={handleDeleteSelectedCartItems}
        className="absolute bottom-5 right-10 z-20 bg-white shadow-lg shadow-black rounded-full size-14"
      >
        <MaterialIcons
          name="delete-forever"
          size={24}
          color="black"
          className="m-auto"
        />
      </MotiPressable>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerClassName="flex-grow"
        refreshing={loading}
        scrollEnabled
        className="mt-8 h-[70%]"
        data={items}
        showsVerticalScrollIndicator={false}
        keyExtractor={({ product }) => `cart-item-${product.id}`}
        ListEmptyComponent={<EmptyScreen message="Cart is empty" />}
        renderItem={({ item: cartItem }) => (
          <CartProductItem
            cartItem={cartItem}
            selectedCartItemIds={selectedCartItemIds}
            setSelectedCartItemIds={setSelectedCartItemIds}
          />
        )}
      />
    </View>
  );
};

export default CartList;
