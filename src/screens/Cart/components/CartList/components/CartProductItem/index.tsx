import { Text } from '@/components/AppText';
import CartQuantityInput from '@/components/CartQuantityInput';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from '@/components/ui/checkbox';
import { getPriceDisplay } from '@/helpers/product';
import { useCart } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from 'expo-router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';

interface Props {
  cartItem: CartItem;
  selectedCartItemIds: string[];
  setSelectedCartItemIds: Dispatch<SetStateAction<string[]>>;
}

const CartProductItem = ({
  cartItem,
  selectedCartItemIds,
  setSelectedCartItemIds,
}: Props) => {
  const { handleUpdateQuantity } = useCart();

  const { updating } = useAppSelector((store) => store.cart.status);

  const [quantityInput, setQuantityInput] = useState<string>(
    String(cartItem.quantity) || '1',
  );

  const disabled = updating?.[cartItem.product.id];

  useEffect(() => {
    setQuantityInput(String(cartItem.quantity));
  }, [cartItem.quantity]);

  const debounceRef = useRef<number | null>(null);

  const updateCartProductQuantity = (newQuantity: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(async () => {
      await handleUpdateQuantity(cartItem.product.id, newQuantity);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <View className="shadow-md bg-white max-md:aspect-[310/100] aspect-[310/60] w-full rounded-3xl overflow-hidden mb-6 flex-row items-center">
      <Link
        href={`/products/${cartItem.product.slug}`}
        className="md:w-1/5 w-[30%] h-full"
      >
        <Image
          source={{ uri: cartItem.product.images[0] }}
          className="size-full object-contain"
          style={{ objectFit: 'contain' }}
        />
      </Link>
      <View className="md:w-4/5 w-2/3 h-full p-4 relative">
        <Checkbox
          onChange={() => {
            if (
              selectedCartItemIds.some(
                (cartItemId) => cartItemId === cartItem.product.id,
              )
            ) {
              setSelectedCartItemIds((prevCartItemIds) =>
                prevCartItemIds.filter(
                  (cartItemId) => cartItemId !== cartItem.product.id,
                ),
              );
            } else {
              setSelectedCartItemIds((prevCartItemIds) => [
                ...prevCartItemIds,
                cartItem.product.id,
              ]);
            }
          }}
          className="absolute top-4 right-2 size-10 flex-row justify-end"
          value="as"
          isDisabled={disabled}
          isInvalid={disabled}
          size="md"
        >
          <CheckboxIndicator className="data-[checked=true]:border-green-600 border-muted data-[checked=true]:bg-green-600">
            <CheckboxIcon
              className="m-auto"
              classNameColor="white"
              as={() => <AntDesign name="check" color="white" />}
            />
          </CheckboxIndicator>
        </Checkbox>
        <Text
          className="mb-2 font-medium pr-5 text-base/tight"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {cartItem.product.title}
        </Text>
        <Text className="text-base font-semibold">
          {getPriceDisplay(cartItem.product)}
        </Text>
        <View className="flex-row items-center justify-between w-full absolute bottom-2 left-4">
          <Text className="text-sm text-slate-gray">
            {cartItem.product.category.title}
          </Text>
          <CartQuantityInput
            disabled
            value={quantityInput}
            setQuantityInput={setQuantityInput}
            updateQuantity={updateCartProductQuantity}
            inputValueClassName="text-slate-gray font-bold p-0"
            parentClassName="max-md:w-24 w-32 border-slate-gray"
            btnClassName=""
            btnSignClassName="text-slate-gray font-bold"
            btnsDisabled={disabled}
          />
        </View>
      </View>
    </View>
  );
};

export default CartProductItem;
