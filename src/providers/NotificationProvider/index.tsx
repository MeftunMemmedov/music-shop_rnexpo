import { NOTIFICATION_QUERY_KEY } from '@/constants/querykeys';
import { NOTIFICATIONS_SETTINGS_KEY } from '@/constants/storagekeys';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import Device from 'expo-device';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  cancelAllScheduledNotificationsAsync,
  DEFAULT_ACTION_IDENTIFIER,
  getPermissionsAsync,
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
  setNotificationHandler,
  useLastNotificationResponse,
} from 'expo-notifications';
import { RelativePathString, useRouter } from 'expo-router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface ProvederProps {
  children: ReactNode;
}

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }: ProvederProps) => {
  const router = useRouter();

  const { isAuth, isRequestFinished } = useAppSelector((store) => store.user);
  const { items } = useAppSelector((store) => store.cart);

  const queryClient = useQueryClient();

  useEffect(() => {
    const foregroundNotificationListener = addNotificationReceivedListener(
      () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      },
    );

    return () => {
      foregroundNotificationListener.remove();
    };
  }, [queryClient]);

  const [hasNotificationPermission, setHasNotificationPermission] =
    useState<boolean>(false);

  const stateRef = useRef<{
    auth: boolean;
    cartItems: CartItem[] | null;
    currentNotificationPermission: boolean;
    authRequestFinished: boolean;
  } | null>(null);

  useEffect(() => {
    stateRef.current = {
      auth: isAuth,
      cartItems: items,
      currentNotificationPermission: hasNotificationPermission,
      authRequestFinished: isRequestFinished,
    };
  }, [isAuth, items, hasNotificationPermission, isRequestFinished]);

  const lastNotificationResponse = useLastNotificationResponse();

  const clearAllScheduledNotifications = async () => {
    try {
      await cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE CLEANING NOTIFICATIONS', error);
    }
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (!Device.isDevice) return;

      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }
      setHasNotificationPermission(finalStatus === 'granted');

      // if (finalStatus !== 'granted') return;

      // try {
      //   const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      //   if (!projectId) {
      //     console.warn('EAS Project id has not been found.');
      //     return;
      //   }

      //   const tokenData = await Notifications.getExpoPushTokenAsync({
      //     projectId,
      //   });

      //   const pushToken = tokenData.data;

      //   console.log('Token that should post to supabase', pushToken);
      // } catch (error) {
      //   console.error('AN ERROR OCCURED WHILE GETTING EXPO PUSH TOKEN', error);
      // }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === DEFAULT_ACTION_IDENTIFIER
    ) {
      const route =
        lastNotificationResponse.notification.request.content.data.route;

      if (route) {
        router.push(route as RelativePathString);
      }
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    const responseListener = addNotificationResponseReceivedListener((res) => {
      const route = res.notification.request.content.data.route;
      if (route) {
        router.push(route as RelativePathString);
      }
    });

    return () => {
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    clearAllScheduledNotifications();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        if (!stateRef.current) return;

        const {
          auth,
          cartItems,
          currentNotificationPermission,
          authRequestFinished,
        } = stateRef.current;

        if (!currentNotificationPermission) return;

        if (nextAppState === 'active') {
          clearAllScheduledNotifications();
        } else if (nextAppState === 'background') {
          let userSettings = {
            show_notifications: true,
            notification_sounds: false,
          };

          try {
            const savedSettings = await AsyncStorage.getItem(
              NOTIFICATIONS_SETTINGS_KEY,
            );

            if (savedSettings) {
              userSettings = JSON.parse(savedSettings);
            }
          } catch (error) {
            console.error(
              'AN ERROR OCCURED WHILE GETTING NOTIFICATION SETTINGs',
              error,
            );
          }

          if (!userSettings.show_notifications) return;
          const canPlaySound = userSettings.notification_sounds;
          // MISS NOTIFICATION
          await scheduleNotificationAsync({
            content: {
              title: 'We missed you!',
              body: `To not miss trending products and to see special opportunities, ${auth ? 'come back' : 'sign in now'}!`,
              sound: canPlaySound,
              data: {
                route: auth ? '/' : '/auth/signin',
              },
            },
            trigger: {
              seconds: 60 * 60 * 24 * 3,
              // seconds: 120,
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              repeats: false,
            },
          });

          // INVENTORY NOTIFICATION
          if (authRequestFinished) {
            if (authRequestFinished && cartItems && cartItems.length > 0) {
              await scheduleNotificationAsync({
                identifier: 'cart-abandonment',
                content: {
                  title: 'There are some items in your cart.',
                  body: 'Come back, checkout and complete the shopping.',
                  sound: canPlaySound,
                  data: {
                    route: '/(drawer)/(tabs)/cart',
                  },
                },
                trigger: {
                  seconds: 60 * 60 * 24,
                  // seconds: 60,
                  type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                  repeats: false,
                },
              });
            }
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
  return <>{children}</>;
};

export default NotificationProvider;
