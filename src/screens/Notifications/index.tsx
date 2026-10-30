import { deleteData, patchData } from '@/api/helpers';
import { Text } from '@/components/AppText';
import EmptyScreen from '@/components/EmptyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import SignInMessage from '@/components/SignInMessage';
import { NOTIFICATION_QUERY_KEY } from '@/constants/querykeys';
import useNotifications from '@/hooks/query/useNotifications';
import { useAppSelector } from '@/store/hooks';
import { Notification } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { LayoutAnimation, Pressable, RefreshControl, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ReanimatedSwipable from 'react-native-gesture-handler/ReanimatedSwipeable';

const Notifications = () => {
  const { isAuth, info } = useAppSelector((store) => store.user);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data: notifications, isLoading, refetch } = useNotifications(isAuth);

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteData('shop_notifications', { id: `eq.${id}` });
      } catch (error) {
        console.error('SOME ERROR OCCURED WHILE DELETING NOTIFICATION');
      }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      const prevNotifications = queryClient.getQueryData(
        NOTIFICATION_QUERY_KEY,
      );

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, (old: Notification[]) =>
        old ? old.filter((notif) => notif.id !== id) : [],
      );

      return { prevNotifications };
    },
    onError: (_err, _, context) => {
      if (context?.prevNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEY,
          context.prevNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
    },
  });

  const markOneAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!info) return;
      try {
        await patchData(
          'shop_notifications',
          { is_read: true },
          {
            id: `eq.${id}`,
            user_id: `eq.${info?.user_id}`,
          },
        );
      } catch (error) {
        console.error(`AN ERROR OCCURED WHILE SET AS READ ${id}`);
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEY });

      const previousNotifications = queryClient.getQueryData([
        'notifications',
        isAuth,
      ]);

      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, (old: any) =>
        old
          ? old.map((notif: any) =>
              notif.id === id ? { ...notif, is_read: true } : notif,
            )
          : [],
      );

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEY,
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!info) return;
      try {
        await patchData(
          'shop_notifications',
          { is_read: true },
          { user_id: `eq.${info.user_id}` },
        );
      } catch (error) {
        console.error(
          'AN ERROR OCCURED WHILE MARKING NOTIFICATIONS AS READ',
          error,
        );
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      const previousNotifications = queryClient.getQueryData(
        NOTIFICATION_QUERY_KEY,
      );
      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, (old: Notification[]) =>
        old ? old.map((notif) => ({ ...notif, is_read: true })) : [],
      );

      return { previousNotifications };
    },
    onError: (err, _, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEY,
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
    },
  });

  if (!isAuth)
    return (
      <View className="h-screen">
        <SignInMessage />
      </View>
    );

  if (isLoading) return <LoadingScreen />;

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE REFRESHING NOTIFICATIONS');
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderLeftActions = () => (
    <View className="justify-center pl-6 rounded-xl mb-4 flex-1">
      <Text className="font-bold text-base">Deleting...</Text>
    </View>
  );

  return (
    <FlatList
      className="mt-28"
      contentContainerClassName="flex-grow container"
      keyExtractor={({ id }) => `notification-${id}`}
      scrollEnabled
      showsVerticalScrollIndicator={false}
      refreshing={isRefreshing}
      data={notifications}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
      }
      ListEmptyComponent={<EmptyScreen message="No notification found." />}
      ListHeaderComponent={
        isAuth && notifications && notifications.length > 0 ? (
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-3xl font-bold">Notifications</Text>
            <Pressable onPress={() => markAllAsReadMutation.mutate()}>
              <Text className="underline">Mark all as read</Text>
            </Pressable>
          </View>
        ) : null
      }
      renderItem={({ item: notification }) => (
        <ReanimatedSwipable
          key={notification.id}
          renderLeftActions={renderLeftActions}
          onSwipeableWillOpen={(dir) => {
            if (dir === 'right') {
              deleteNotificationMutation.mutate(notification.id);
            }
          }}
          overshootLeft={false}
        >
          <Link
            href={notification.route ?? ''}
            disabled={!notification.route}
            asChild
          >
            <Pressable
              className="p-4 rounded-xl mb-4 bg-white shadow-lg shadow-black w-[95%] mx-auto relative"
              onPress={() => markOneAsReadMutation.mutate(notification.id)}
            >
              {!notification.is_read && (
                <View className="size-3 bg-red-500 rounded-full absolute right-4 top-4" />
              )}
              <Text className="font-bold text-xl mb-1">
                {notification.title}
              </Text>
              <Text>{notification.body}</Text>
            </Pressable>
          </Link>
        </ReanimatedSwipable>
      )}
    />
  );
};

export default Notifications;
