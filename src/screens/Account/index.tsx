import AccountInfo from '@/components/AccountInfo';
import { Text } from '@/components/AppText';
import BottomSpace from '@/components/BottomSpace';
import LoadingScreen from '@/components/LoadingScreen';
import SignInMessage from '@/components/SignInMessage';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { USER_INFO_KEY } from '@/constants/storagekeys';
import { styles } from '@/constants/style';
import { useWishlist } from '@/hooks';
import { clearLocalOrders, initOrderDB } from '@/sqlite/order';
import { clearInventoryItems } from '@/store/cart/asyncThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logUserOut } from '@/store/user/asyncThunks';
import { AccountNav } from '@/types/account';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Fragment, useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const Account = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const {
    isAuth,
    status: {
      user: { loading },
    },
  } = useAppSelector((store) => store.user);

  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    if (isAuth) {
      initOrderDB();
    }
  }, [isAuth]);

  if (loading) return <LoadingScreen />;

  if (!isAuth)
    return (
      <View className="h-screen">
        <SignInMessage />
      </View>
    );

  const accountNavList: AccountNav[] = [
    {
      label: `My wishlist (${wishlistCount})`,
      icon: <Fontisto name="heart" size={20} color="gray" />,
      onPress: () => {
        router.push({
          pathname: '/account/wishlist',
          params: { title: 'Wishlist' },
        });
      },
    },
    {
      label: 'My orders',
      icon: <Fontisto name="shopping-basket" size={20} color="gray" />,
      onPress: () => {
        router.push('/account/orders');
      },
    },
    {
      label: 'My comments',
      icon: <Fontisto name="comment" size={20} color="gray" />,
      onPress: () => {
        router.push('/account/usercomments');
      },
    },
    {
      label: 'Log out',
      icon: <SimpleLineIcons name="logout" size={20} color="gray" />,
      onPress: async () => {
        await AsyncStorage.removeItem(USER_INFO_KEY);
        dispatch(logUserOut());
        dispatch(clearInventoryItems());
        clearLocalOrders();
        router.replace('/(drawer)/(tabs)');
      },
    },
  ];

  return (
    <ScrollView contentContainerClassName="container pt-16">
      <AccountInfo />

      <VStack
        className="rounded-3xl px-4 py-2 md:mt-[45px] mt-[71px]"
        style={styles.shadow}
      >
        {accountNavList.map((nav, index, arr) => (
          <Fragment key={`account-nav-${nav.label}`}>
            <Pressable
              className={`flex-row items-center justify-between py-7 border-gray-300 `}
              onPress={nav.onPress}
            >
              <View className="flex-row items-center gap-4">
                {nav.icon}
                <Text className="text-lg">{nav.label}</Text>
              </View>
              {index !== arr.length - 1 && (
                <View>
                  <Entypo
                    name={'chevron-small-right'}
                    size={30}
                    color="black"
                  />
                </View>
              )}
            </Pressable>
            {index !== arr.length - 1 && <Divider />}
          </Fragment>
        ))}
      </VStack>
      <BottomSpace />
    </ScrollView>
  );
};

export default Account;
