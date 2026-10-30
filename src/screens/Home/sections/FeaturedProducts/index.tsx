import ProductList from '@/components/ProductList';
import { Link } from 'expo-router';
import { View } from 'react-native';

import { getDataList } from '@/api/helpers';
import { Text } from '@/components/AppText';
import { PRODUCT_SELECT_PARAM } from '@/constants/params';
import { getFeaturedProductsFromDB, saveProductsToDB } from '@/sqlite/product';
import { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';

const FeaturedProducts = () => {
  const { data, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      try {
        const apiFeaturedProducts = await getDataList<Product>(
          'shop_products',
          {
            is_featured: 'eq.true',
            select: PRODUCT_SELECT_PARAM,
          },
        );
        if (apiFeaturedProducts && apiFeaturedProducts.length > 0) {
          saveProductsToDB(apiFeaturedProducts);
        }
        return apiFeaturedProducts;
      } catch (error) {
        const localFeaturedProducts = getFeaturedProductsFromDB();
        if (localFeaturedProducts.length === 0) throw error;
        return localFeaturedProducts;
      }
    },
  });

  if (!data || data.length === 0 || error) return null;
  return (
    <View className="mt-8 mb-5">
      <View className="container flex-row justify-between items-center">
        <Text className="text-2xl font-semibold text-black">
          Featured Products
        </Text>

        <Link className="text-muted font-sans leading-tight" href={'/search'}>
          Show all
        </Link>
      </View>
      <ProductList
        data={data}
        horizontal
        className="pl-3 mt-8"
        keyTitle="featured-product"
      />
    </View>
  );
};

export default FeaturedProducts;
