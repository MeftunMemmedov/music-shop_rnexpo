import { getDataList } from '@/api/helpers';
import { MovingDotLoader } from '@/components/MovingDotLoader';
import ProductList from '@/components/ProductList';

import { Product, ProductFilterParams } from '@/types';

import SortSelect from '@/components/SortSelect';
import { RECENT_SEARCHES_KEY } from '@/constants/storagekeys';
import { appendProductSearchParams } from '@/helpers/product';
import { useCategories } from '@/hooks/query';
import { getAllProductsFromDB } from '@/sqlite/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import RecentSearches from './components/RecentSearches';
import SearchInput from './components/SearchInput';

const Search = () => {
  const router = useRouter();
  // const queryClient = useQueryClient();

  const { isConnected } = useNetInfo();
  const { data: categories } = useCategories();

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentSearchesLoaded, setIsRecentSearchesLoaded] =
    useState<boolean>(false);

  const searchInputVal = searchInput.trim();
  const debouncedVal = debouncedValue.trim();

  const isSearchInputEmpty = searchInput === '';

  const searchParams = useLocalSearchParams<ProductFilterParams>();

  const { orderQuery, ...otherSearchParams } = searchParams;

  // useEffect(() => {
  //   if (isSearchEmpty) {
  //     queryClient.invalidateQueries({ queryKey: ['products'] });
  //   }
  // }, [isSearchEmpty, queryClient]);
  const isFilterUninitialized =
    searchInput === '' &&
    Object.values(otherSearchParams).every((val) => val === undefined);

  const {
    data: results,
    refetch,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: ['products', debouncedValue, searchParams],
    queryFn: async () => {
      if (isFilterUninitialized) {
        return getAllProductsFromDB(searchParams.orderQuery);
      }
      try {
        const urlSearchParams = new URLSearchParams();

        const params = appendProductSearchParams(
          urlSearchParams,
          searchParams,
          categories,
        );

        urlSearchParams.append('limit', '12');

        if (debouncedValue !== '') {
          urlSearchParams.append('title', `ilike.*${debouncedVal}*`);
        } else {
          urlSearchParams.delete('title');
        }

        const results = await getDataList<Product>('shop_products', params);

        // if (networkData && networkData.length > 0 && isSearchEmpty) {
        //   saveProductsToDB(networkData);
        // }
        return results;
      } catch {
        return [];
      }
    },
    placeholderData: keepPreviousData,
    enabled: true,
  });

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const onProductCardPress = () => {
    if (!debouncedVal) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((searchKey) => searchKey !== debouncedVal);
      return [debouncedVal, ...filtered];
    });
  };

  useEffect(() => {
    const timeOut = setTimeout(() => setDebouncedValue(searchInputVal), 500);

    return () => clearTimeout(timeOut);
  }, [searchInput]);

  useEffect(() => {
    const getRecentSearchesStorage = async () => {
      try {
        const recentSearchesStorage =
          await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        setRecentSearches(
          recentSearchesStorage ? JSON.parse(recentSearchesStorage) : [],
        );
      } catch (error) {
        console.error('AN ERROR OCCURED WHILE GETTING RECENT SEARCHES', error);
      } finally {
        setIsRecentSearchesLoaded(true);
      }
    };
    getRecentSearchesStorage();
  }, []);

  useEffect(() => {
    if (!isRecentSearchesLoaded) return;

    const addSearchKey = async () => {
      try {
        await AsyncStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(recentSearches),
        );
      } catch (error) {
        console.error(
          'AN ERROR OCCURED WHILE ADDIN NEW RECENT SEARCH KEY',
          error,
        );
      }
    };
    addSearchKey();
  }, [recentSearches, isRecentSearchesLoaded]);

  const isNetConnectionActive = isConnected === true;

  return (
    <View className="container pt-28 flex-1">
      <SearchInput
        isInputDisabled={!isNetConnectionActive}
        disabled={
          isLoading || isFetching || isRefetching || !isNetConnectionActive
        }
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        isSearchInputEmpty={isSearchInputEmpty}
        searchParams={searchParams}
      />
      {isSearchInputEmpty && (
        <RecentSearches
          recentSearches={recentSearches}
          setRecentSearches={setRecentSearches}
          setSearchInput={setSearchInput}
          disabled={!isNetConnectionActive}
        />
      )}
      <View className="py-2">
        <SortSelect
          className="ml-auto"
          isDisabled={results?.length === 0}
          onChange={(val) => router.setParams({ orderQuery: val })}
        />
      </View>
      {(isLoading || isFetching) && !isRefreshing ? (
        <View className="mt-5">
          <MovingDotLoader dotClassName="bg-charcoal" />
        </View>
      ) : (
        results && (
          <ProductList
            onRefresh={isConnected === true ? onRefresh : undefined}
            isRefreshing={isRefreshing}
            onProductCardPress={onProductCardPress}
            data={results}
            keyTitle="search-result"
            className="flex-1"
          />
        )
      )}
    </View>
  );
};

export default Search;
