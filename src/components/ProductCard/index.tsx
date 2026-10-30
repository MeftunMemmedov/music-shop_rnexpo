import { CategoryIcon } from '@/assets/images';
import { getPriceDisplay } from '@/helpers/product';
import { useCart, useWishlist } from '@/hooks';
import { Product } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Text } from '../AppText';
import ProductActionSheet from './components/ProductActionSheet';

interface Props {
  product: Product;
  className?: string;
  isWishlistScreen?: boolean;
  onProductCardPress?: () => void;
}

const ProductCard = ({
  product,
  className,
  isWishlistScreen = false,
  onProductCardPress,
}: Props) => {
  const { handleToggleCart, getProductInCart } = useCart();

  const { isInWishlist, toggle: toggleWishlist } = useWishlist();

  const [isPressed, setIsPressed] = useState<boolean>(false);

  const [isActionSheetVisible, setIsActionSheetVisible] =
    useState<boolean>(false);

  const isProductInCart = !!getProductInCart(product.id);
  const isProductInWishlist = isInWishlist(product.id);

  return (
    <>
      <Link href={`/products/${product.slug}`} asChild>
        <Pressable
          {...(onProductCardPress && { onPress: onProductCardPress })}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          className={`w-[126px] ${className}`}
          onLongPress={() => {
            setIsActionSheetVisible(true);
          }}
        >
          <MotiView animate={{ scale: isPressed ? 1.1 : 1 }}>
            <View className="aspect-[126/172] rounded-md overflow-hidden relative">
              <View className="absolute bottom-3 left-3 flex-row gap-1 items-center z-10">
                {isProductInCart && (
                  <View className="bg-white rounded-md py-1 px-1.5">
                    <MaterialCommunityIcons
                      name="cart-check"
                      size={12}
                      color="black"
                    />
                  </View>
                )}
                {isProductInWishlist && (
                  <View className="bg-white rounded-md py-1 px-1.5">
                    <Entypo name="heart" size={12} color="red" />
                  </View>
                )}
              </View>
              {product.discount > 0 && (
                <View className="absolute top-2 left-2 z-10 bg-red-500 px-2 py-1 rounded-md flex-row items-center gap-0.5">
                  <Text className="text-white text-xs sm:text-sm">
                    {product.discount}%
                  </Text>
                  <FontAwesome6 name="arrow-down-long" size={8} color="white" />
                </View>
              )}
              {isWishlistScreen && (
                <Pressable
                  className="bg-white size-10 aspect-square shadow-xl flex-row rounded-full justify-center items-center absolute top-1.5 right-1.5 z-20"
                  onPress={() => toggleWishlist(product)}
                >
                  <MaterialIcons
                    name="delete-forever"
                    size={24}
                    color="black"
                  />
                </Pressable>
              )}
              <Image
                source={{ uri: product.images[0] }}
                className="size-full"
                style={{ objectFit: 'contain' }}
              />
            </View>
            <View className="mt-4">
              <View className="flex-row-reverse items-center gap-2">
                <View className="size-3 aspect-square">
                  <Image
                    width={10}
                    height={10}
                    className="size-full object-contain"
                    style={{ objectFit: 'contain' }}
                    source={
                      product.category.image
                        ? { uri: product.category.image }
                        : CategoryIcon
                    }
                  />
                </View>
                {product.brand && (
                  <>
                    <View className="w-[1px] h-2.5 bg-black" />
                    <Text
                      className="text-2xs"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {product.brand.title}
                    </Text>
                  </>
                )}
              </View>

              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="text-sm text-[#1D1F22] font-semibold"
              >
                {product.title}
              </Text>
              <Text className="text-sm text-[#1D1F22] font-bold">
                {getPriceDisplay(product)}
              </Text>
            </View>
          </MotiView>
        </Pressable>
      </Link>
      {isActionSheetVisible}
      <ProductActionSheet
        product={product}
        isActionSheetVisible={isActionSheetVisible}
        setIsActionSheetVisible={setIsActionSheetVisible}
        isProductInCart={isProductInCart}
        handleToggleCart={handleToggleCart}
        isProductInWishlist={isProductInWishlist}
        handleToggleWishlist={toggleWishlist}
      />
    </>
  );
};

export default ProductCard;
