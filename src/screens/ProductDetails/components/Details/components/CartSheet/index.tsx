import { Text } from '@/components/AppText';
import CartQuantityInput from '@/components/CartQuantityInput';
import { colors } from '@/constants/style';
import { useCart } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import { Product } from '@/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

const CartSheet = ({ product }: { product: Product }) => {
  const { getProductInCart, handleToggleCart, handleUpdateQuantity } =
    useCart();

  const { updating } = useAppSelector((store) => store.cart.status);

  const productInCart = getProductInCart(product.id);

  const productQuantity = String(productInCart?.quantity || 1);

  const [quantityInput, setQuantityInput] = useState<string>(productQuantity);

  const quantityValue = parseInt(quantityInput);

  // toast

  // BOTTOMSHEET
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const handleSheetIndexes = (index: number) => {
    setIsSheetOpen(index > 0);
    if (index === 0 && quantityInput === '') {
      setQuantityInput('1');
    }
  };

  const handleQuantityInput = async <T extends Product | string>(
    target: T,
    action: (product: T, quantity: number) => Promise<void>,
  ) => {
    if (quantityInput.trim() === '' || quantityInput.trim() === '0') {
      await action(target, 1);
      setQuantityInput('1');
    } else {
      await action(target, quantityValue);
    }
  };

  const snapPoints = useMemo(() => ['60%'], []);

  const btnDisabled = updating?.[product.id];

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'collapse'}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    [],
  );
  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      onChange={handleSheetIndexes}
      backdropComponent={renderBackdrop}
      enableOverDrag
      handleIndicatorStyle={{ backgroundColor: 'gray', width: 40 }}
      backgroundStyle={{
        backgroundColor: !!productInCart ? '#690101' : colors.charcoal,
      }}
    >
      <BottomSheetView>
        <Pressable
          disabled={btnDisabled}
          className="flex-row justify-center h-24"
          onPress={() => handleQuantityInput(product, handleToggleCart)}
        >
          <View className="flex-row items-center gap-3 mb-8">
            {productInCart ? (
              <MaterialCommunityIcons
                name="cart-remove"
                size={24}
                color="white"
              />
            ) : (
              <MaterialCommunityIcons
                name="cart-plus"
                size={24}
                color="white"
              />
            )}
            <Text className="text-white font-semibold text-xl">
              {productInCart ? 'Remove from cart' : 'Add to cart'}
            </Text>
          </View>
        </Pressable>
        {isSheetOpen && (
          <View className="w-full">
            <CartQuantityInput
              value={quantityInput}
              setQuantityInput={setQuantityInput}
              inputValueClassName="text-white"
              autoFocus={isSheetOpen}
              parentClassName="border-white m-auto w-44 mb-6"
              btnClassName="bg-white"
              btnSignClassName="text-xl font-semibold"
              btnsDisabled={btnDisabled}
            />
            {productInCart && productQuantity !== quantityInput && (
              <View>
                <Pressable
                  onPress={() => {
                    handleQuantityInput(product.id, handleUpdateQuantity);
                  }}
                  className="m-auto px-5 py-3 bg-white rounded-full"
                >
                  <Text>Update Quantity</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CartSheet;
