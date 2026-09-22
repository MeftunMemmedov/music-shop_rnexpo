import { useResponsive } from '@/hooks';
import { Product } from '@/types';
import { ComponentType, JSXElementConstructor, ReactElement } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import EmptyScreen from '../EmptyScreen';
import ProductCard from '../ProductCard';

interface Props {
  data: Product[];
  keyTitle: string;
  isRefreshing?: boolean;
  onRefresh?: () => Promise<any> | void;
  onProductCardPress?: () => void;
  className?: string;
  contentContainerClassName?: string;
  productCardClassName?: string;
  horizontal?: boolean;
  isWishlistScreen?: boolean;
  ListEmptyComponent?:
    | ComponentType<any>
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | null
    | undefined;
}

const ProductList = ({
  data,
  keyTitle,
  isRefreshing,
  onRefresh,
  onProductCardPress,
  className,
  contentContainerClassName,
  productCardClassName,
  horizontal = false,
  isWishlistScreen = false,
  ListEmptyComponent = <EmptyScreen message="No products found" />,
}: Props) => {
  const { isTablet } = useResponsive();
  const numColumns = isTablet ? 4 : 2;
  return (
    <FlatList
      data={data}
      ListEmptyComponent={ListEmptyComponent}
      key={horizontal ? 'hrzntl-prod-lst' : `vrtcl-prod-list-${numColumns}`}
      keyExtractor={({ id }) => `${keyTitle}-${id}`}
      className={`${className} py-3`}
      contentContainerClassName={`flex-grow ${contentContainerClassName}`}
      numColumns={horizontal ? undefined : numColumns}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={horizontal}
      refreshing={isRefreshing}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing ?? false}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      renderItem={({ item }) =>
        horizontal ? (
          <ProductCard
            product={item}
            className={`mr-5 ${productCardClassName}`}
          />
        ) : (
          <View className="flex-row max-md:w-1/2 w-1/4 justify-center mb-5">
            <ProductCard
              {...(onProductCardPress && { onProductCardPress })}
              product={item}
              className={productCardClassName}
              isWishlistScreen={isWishlistScreen}
            />
          </View>
        )
      }
    />
  );
};

export default ProductList;
