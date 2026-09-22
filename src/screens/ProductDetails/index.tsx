import { getData, getDataList } from '@/api/helpers';
import Header from '@/components/Header';
import LoadingScreen from '@/components/LoadingScreen';
import NotFoundScreen from '@/components/NotFoundScreen';
import { useWishlist } from '@/hooks';
import { getProductBySlugFromDB, saveProductToDB } from '@/sqlite/product';
import { useAppSelector } from '@/store/hooks';
import { Comment, Product } from '@/types';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { MotiScrollView } from 'moti';
import { useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Details from './components/Details';
import CartSheet from './components/Details/components/CartSheet';
import ImageGallery from './components/ImageGallery';

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { isAuth } = useAppSelector((store) => store.user);
  const { isConnected } = useNetInfo();

  const { isInWishlist, toggle: toggleWishlist } = useWishlist();

  const queryClient = useQueryClient();

  const [
    { data: product, refetch: refetchProduct, isLoading: isProductLoading },
    { data: comments, refetch: refetchComments, isLoading: isCommentsLooading },
  ] = useQueries({
    queries: [
      {
        queryKey: [`product/${slug}`],
        queryFn: async () => {
          try {
            const product = await getData<Product>('shop_products', {
              slug: `eq.${slug}`,
              select: '*,category(title,image,slug),brand(title)',
            });

            return product;
          } catch (error) {
            const localProduct = getProductBySlugFromDB(slug);
            if (!localProduct) throw error;
            return localProduct;
          }
        },
      },

      {
        queryKey: [`comments/${slug}`],
        queryFn: () =>
          getDataList<Comment>('shop_comments', {
            select: '*,product(*),user:user_id(*)',
            product: `eq.${slug}`,
          }),
      },
    ],
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      'worklet';
      scrollY.value = e.contentOffset.y;
    },
  });

  useEffect(() => {
    if (product) {
      saveProductToDB(product);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  }, [product?.id]);

  if (isProductLoading) return <LoadingScreen />;
  if (!product) return <NotFoundScreen message="Product not found" />;

  const isProductInWishlist = isInWishlist(product.id);

  const handleToggleWishlistItem = () => {
    toggleWishlist(product);
  };

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([refetchComments(), refetchProduct()]);
    } finally {
      setIsRefreshing(false);
    }
  };
  const images = product.images.map((url) => ({ url, alt: '' }));

  const isConectionActive = isConnected === true;
  return (
    <View style={{ flex: 1 }}>
      <Header
        type="productdetails"
        handleToggleWishlistItem={handleToggleWishlistItem}
        isProductInWishlist={isProductInWishlist}
        // productId={product.id}
      />
      <MotiScrollView
        refreshControl={
          isConectionActive ? (
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        <ImageGallery scroll_Y_value={scrollY.value} images={images} />
        <Details
          product={product}
          comments={comments || []}
          isCommentsLooading={isCommentsLooading}
        />
      </MotiScrollView>
      <View className="h-32" />
      {isConnected === false && isAuth ? null : <CartSheet product={product} />}
    </View>
  );
};

export default ProductDetails;
