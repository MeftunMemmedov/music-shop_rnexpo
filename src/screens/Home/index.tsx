import BottomSpace from '@/components/BottomSpace';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import NoConnectionScreen from '@/components/NoConnectionScreen';
import { useBrands, useCategories, useSlides } from '@/hooks/query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFirstLaunch } from '@/store/user';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import * as Sections from './sections';

const Home = () => {
  const { isConnected } = useNetInfo();

  const dispatch = useAppDispatch();

  const { isFirstLaunch } = useAppSelector((store) => store.user);

  const {
    refetch: refetchCategories,
    isLoading: isCategoriesLoading,
    isRefetching: isCategoriesRefetching,
    error: categoryError,
  } = useCategories();
  const {
    refetch: refetchBrands,
    isLoading: isBrandsLoading,
    isRefetching: isBrandsRefetching,
    error: brandError,
  } = useBrands();

  const {
    refetch: refetchSlides,
    isLoading: isSlidesLoading,
    isRefetching: isSlidesRefetching,
    error: slideError,
  } = useSlides();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!isFirstLaunch) return;

    const timeout = setTimeout(() => {
      dispatch(setFirstLaunch(false));
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isFirstLaunch]);

  if (
    isBrandsLoading ||
    isCategoriesLoading ||
    isSlidesLoading ||
    isBrandsRefetching ||
    isCategoriesRefetching ||
    isSlidesRefetching
  )
    return <LoadingScreen />;

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetchBrands();
      await refetchSlides();
      await refetchCategories();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (categoryError || brandError || slideError)
    return <ErrorScreen refresh={onRefresh} />;

  if (isFirstLaunch && isConnected === false)
    return <NoConnectionScreen refresh={onRefresh} />;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        isConnected ? (
          <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
        ) : undefined
      }
    >
      <View className="container">
        <Sections.CategorySlider />
        <Sections.MainSlider />
      </View>
      <Sections.FeaturedProducts />
      {/* <Sections.Campaign /> */}
      <BottomSpace />
    </ScrollView>
  );
};

export default Home;
