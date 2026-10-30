import { NOTIFICATION_QUERY_KEY } from '@/constants/querykeys';
import {
  ensureAndroidChannel,
  getNotificationSettings,
} from '@/helpers/notification';
import { useAppSelector } from '@/store/hooks';
import { CartItem } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import {
  addNotificationReceivedListener,
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
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface ProvederProps {
  children: ReactNode;
}

setNotificationHandler({
  handleNotification: async () => {
    const { show_notifications, notification_sounds } =
      await getNotificationSettings();

    return {
      shouldShowList: show_notifications,
      shouldShowBanner: show_notifications,
      shouldPlaySound: notification_sounds,
      shouldSetBadge: false,
    };
  },
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

  const syncPermissionStatus = useCallback(async () => {
    try {
      const { status } = await getPermissionsAsync();
      setHasNotificationPermission(status === 'granted');
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE SYNCING PERMISSION', error);
    }
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (!Device.isDevice) {
          console.warn('Notifications require a physical device.');
          return;
        }

        const settings = await getNotificationSettings();
        await ensureAndroidChannel(settings);

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
      } catch (error) {
        console.error('AN ERROR OCCURED WHILE REQUESTING PERMISSION', error);
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === DEFAULT_ACTION_IDENTIFIER
    ) {
      const route =
        lastNotificationResponse.notification.request.content.data?.route;

      if (route) {
        router.push(route as RelativePathString);
      }
    }
  }, [lastNotificationResponse, router]);

  useEffect(() => {
    clearAllScheduledNotifications();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          clearAllScheduledNotifications();
          syncPermissionStatus();
          return;
        }

        if (nextAppState !== 'background') return;
        if (!stateRef.current) return;

        const {
          auth,
          cartItems,
          currentNotificationPermission,
          authRequestFinished,
        } = stateRef.current;

        if (!currentNotificationPermission) return;

        const settings = await getNotificationSettings();

        if (!settings.show_notifications) return;
        const canPlaySound = settings.notification_sounds;

        try {
          const channelId = await ensureAndroidChannel(settings);

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
              seconds: 60 * 60 * 24 * 2,
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              repeats: false,
              channelId,
            },
          });

          // CART NOTIFICATION
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
                type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                repeats: false,
                channelId,
              },
            });
          }
        } catch (error) {
          console.error(
            'AN ERROR OCCURED WHILE SCHEDULING NOTIFICATIONS',
            error,
          );
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [syncPermissionStatus]);

  return <>{children}</>;
};

export default NotificationProvider;
