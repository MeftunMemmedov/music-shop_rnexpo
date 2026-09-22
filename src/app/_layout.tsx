import Header from '@/components/Header';

import ConnectionStatus from '@/components/ConnectionStatus';
import LoadingScreen from '@/components/LoadingScreen';
import Providers from '@/components/Providers';
import {
  backHeaderScreenList,
  backTitleSHeaderScreenList,
  noHeaderScreenList,
} from '@/constants/screen';
import { initProductDB } from '@/sqlite/product';
import { useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';

const _originalAnnounce =
  AccessibilityInfo.announceForAccessibility.bind(AccessibilityInfo);
AccessibilityInfo.announceForAccessibility = (announcement: unknown) => {
  if (typeof announcement === 'string') {
    _originalAnnounce(announcement);
  }
};

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, err] = useFonts({
    'ProductSans-Bold': require('../assets/fonts/GoogleSans-Bold.ttf'),
    'ProductSans-Regular': require('../assets/fonts/GoogleSans-Regular.ttf'),
    'ProductSans-Medium': require('../assets/fonts/GoogleSans-Medium.ttf'),
    'ProductSans-Semibold': require('../assets/fonts/GoogleSans-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded || err) {
      SplashScreen.hideAsync();
    }
  }, [loaded, err]);

  useEffect(() => {
    initProductDB();
  }, []);

  if (!loaded && !err) return <LoadingScreen />;

  return (
    <Providers>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          {noHeaderScreenList.map((screenName) => (
            <Stack.Screen
              key={screenName}
              name={screenName}
              options={{ headerShown: false }}
            />
          ))}
          {backHeaderScreenList.map((screenName) => (
            <Stack.Screen
              key={screenName}
              name={screenName}
              options={{
                headerTransparent: true,
                header: () =>
                  screenName === 'products/[slug]' ? undefined : (
                    <Header type="back" />
                  ),
              }}
            />
          ))}
          {backTitleSHeaderScreenList.map((screenName) => (
            <Stack.Screen
              name={screenName}
              key={screenName}
              options={{
                header: ({ route }) => {
                  const { title } = route.params as ProductDetailsScreenParams;
                  return <Header type="back" title={title} />;
                },
              }}
            />
          ))}
        </Stack>
      </GestureHandlerRootView>
      <ConnectionStatus />
    </Providers>
  );
};
export default RootLayout;
