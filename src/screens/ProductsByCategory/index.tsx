import { getDataList } from '@/api/helpers';
import { Text } from '@/components/AppText';
import FilterModal from '@/components/FilterModal';
import { MovingDotLoader } from '@/components/MovingDotLoader';
import ProductList from '@/components/ProductList';
import SortSelect from '@/components/SortSelect';
import { appendProductSearchParams } from '@/helpers/product';
import { useCategories } from '@/hooks/query';
import { getProductsByCategoryFromDB } from '@/sqlite/product';
import { Product, ProductFilterParams } from '@/types';
import { useNetInfo } from '@react-native-community/netinfo';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

const ProductsByCategory = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams<ProductFilterParams>();

  const { isConnected } = useNetInfo();

  const { data: categories } = useCategories();

  const { categoryQuery, slug, orderQuery } = searchParams;

  const activeCategoryQuery = categoryQuery ?? slug;

  const currentParent = categories?.find((c) => c.slug === activeCategoryQuery);

  const categoryHasChildren =
    currentParent?.children && currentParent.children.length > 0;

  const targetcategorySlugs: string[] = categoryHasChildren
    ? currentParent.children.map((c) => c.slug)
    : activeCategoryQuery
      ? [String(activeCategoryQuery)]
      : [];

  const {
    data: productsByCategory,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [`${slug}-products`, searchParams],
    queryFn: async () => {
      const urlSearchParams = new URLSearchParams();

      const params = appendProductSearchParams(
        urlSearchParams,
        searchParams,
        categories,
      );

      try {
        const productsByCategory = await getDataList<Product>(
          'shop_products',
          params,
        );

        return productsByCategory;
      } catch (error) {
        const localFallback = getProductsByCategoryFromDB(
          targetcategorySlugs,
          orderQuery,
        );
        if (localFallback.length === 0) throw error;
        return localFallback;
      }
    },
    placeholderData: keepPreviousData,
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-col gap-3 items-end container mb-2">
        <View className="w-20">
          <FilterModal
            disabled={isLoading || isFetching || isConnected === false}
            isInProductsByCategoryScreen={true}
            withIcon={false}
            categoryFilterDisabled={false}
            btnClassName="aspect-video rounded-full"
            searchParams={searchParams}
          />
        </View>
        <SortSelect
          isDisabled={productsByCategory?.length === 0}
          onChange={(val) => router.setParams({ orderQuery: val })}
        />
      </View>
      {isLoading || isFetching ? (
        <MovingDotLoader dotClassName="bg-charcoal" />
      ) : productsByCategory && productsByCategory.length > 0 ? (
        <ProductList
          onRefresh={isConnected === true ? onRefresh : undefined}
          isRefreshing={isRefreshing}
          data={productsByCategory}
          keyTitle={`product-from-${categoryQuery}`}
          className="flex-1"
        />
      ) : (
        <View className="py-20">
          <Text className="text-center text-lg font-semibold">
            No product found
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductsByCategory;
