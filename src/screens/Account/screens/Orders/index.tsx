import { getDataList } from '@/api/helpers';
import { Text } from '@/components/AppText';
import EmptyScreen from '@/components/EmptyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import { getPriceDisplay, getTotal } from '@/helpers/product';
import { getLocalOrders, saveOrdersToDB } from '@/sqlite/order';
import { useAppSelector } from '@/store/hooks';
import { OrderItem } from '@/types';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

type OrderStatus =
  'all' | 'pending' | 'completed' | 'inproggress' | 'shipped' | 'cancelled';

const Orders = () => {
  const { isConnected } = useNetInfo();

  const { isAuth } = useAppSelector((store) => store.user);

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all');

  const {
    data: orders,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [`orders/${selectedStatus}`],
    queryFn: async () => {
      if (isConnected === false) {
        return getLocalOrders(selectedStatus);
      }

      try {
        const apiOrders = await getDataList<OrderItem>('shop_orders', {
          select:
            '*,items:shop_orderedproducts(quantity,product(id,slug,price,title,images,category,discount))',
          status: selectedStatus !== 'all' ? `eq.${selectedStatus}` : undefined,
        });

        if (apiOrders && apiOrders.length > 0) {
          saveOrdersToDB(apiOrders);
        }

        return apiOrders;
      } catch {
        return getLocalOrders(selectedStatus);
      }
    },
    enabled: isAuth && isConnected !== null,
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

  const orderStatusList: { label: string; value: OrderStatus }[] = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Pending',
      value: 'pending',
    },
    // { label: 'In Proggress', value: 'inproggress' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Canceled', value: 'cancelled' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <View className="container flex-1">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        orders && (
          <FlatList
            contentContainerClassName="grow pb-10"
            stickyHeaderIndices={[0]}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyExtractor={({ id }) => `order-${id}`}
            data={orders}
            refreshing={isRefreshing}
            ListHeaderComponent={
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="w-full"
                contentContainerClassName="gap-4 bg-white pb-6 pt-28 w-full"
              >
                {orderStatusList.map((orderStatus) => (
                  <Pressable
                    key={orderStatus.value}
                    onPress={() => setSelectedStatus(orderStatus.value)}
                    className={`px-5 h-10 rounded-full border border-charcoal ${selectedStatus === orderStatus.value ? 'bg-charcoal' : 'bg-white'} justify-center`}
                  >
                    <Text
                      className={`font-medium ${selectedStatus === orderStatus.value ? 'text-white' : 'text-charcoal'}`}
                    >
                      {orderStatus.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            }
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={<EmptyScreen message="No order found" />}
            renderItem={({ item: order }) => (
              <View className="p-5 flex-col gap-4 rounded-xl mb-5 shadow-md bg-white">
                <View className="flex-row items-center justify-between">
                  <Text
                    className="font-medium text-sm w-1/2"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Order #{order.id}
                  </Text>
                  <Text className="text-gray-500">
                    {format(order.created_at, 'dd/MM/yyyy')}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-gray-400 text-sm">Quantity:</Text>
                    <Text className="font-medium text-sm">
                      {order.items.length} products
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-gray-400">Total:</Text>
                    <Text className="font-medium text-sm">
                      {`${getPriceDisplay(getTotal(order.items))} for ${order.items.length} items`}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text>{order.status}</Text>
                  <Link
                    href={{
                      pathname: `/account/orders/[id]`,
                      params: {
                        id: order.id,
                        title: `#${order.id}`,
                      },
                    }}
                    className=" py-2 px-6 rounded-full border"
                  >
                    <Text className="font-medium">Details</Text>
                  </Link>
                </View>
              </View>
            )}
          />
        )
      )}
    </View>
  );
};

export default Orders;
