import { getData } from '@/api/helpers';
import AccordionRow from '@/components/AccordionRow';
import { Text } from '@/components/AppText';
import LoadingScreen from '@/components/LoadingScreen';
import { Accordion } from '@/components/ui/accordion';
import {
  TableBody,
  TableData,
  TableFooter,
  TableRow,
} from '@/components/ui/table';
import { shippingMethods } from '@/constants/shipping';
import { getPriceDisplay, getTotal } from '@/helpers/product';
import { getLocalOrderById } from '@/sqlite/order';
import { useAppSelector } from '@/store/hooks';
import { OrderItem } from '@/types';
import { Table } from '@expo/html-elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

const OrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { isAuth } = useAppSelector((store) => store.user);

  const { isConnected } = useNetInfo();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`order#${id}`],
    queryFn: async () => {
      if (isConnected === false) {
        return getLocalOrderById(id);
      }
      try {
        const apiOrder = getData<OrderItem>('shop_orders', {
          select:
            '*,items:shop_orderedproducts(quantity,product(id,slug,price,title,images,category,discount))',
          id: `eq.${id}`,
        });
        return apiOrder;
      } catch {
        return getLocalOrderById(id);
      }
    },

    enabled: isAuth && isConnected !== null,
  });

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (!order) return null;

  const shipingTypeInfo = shippingMethods.find(
    (shipMethod) => shipMethod.value === order.ship_method,
  );

  const orderInfos: { title: string; value: string }[] = [
    { title: 'Order', value: `#${order.id}` },
    { title: 'Address', value: order.address },
    { title: 'Date', value: format(order.created_at, 'dd MMMM yyyy') },
    {
      title: 'Shipment Type',
      value: `${shipingTypeInfo?.title}`,
    },
    {
      title: 'Shipping price',
      value: shipingTypeInfo ? getPriceDisplay(+shipingTypeInfo.price) : '',
    },
    {
      title: 'Payment type',
      value: order.pay_method,
    },
  ];
  return (
    <ScrollView
      className="container"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <Link href={`/account/orders/${id}/tracking`} asChild>
        <Pressable className="flex-row items-center p-8 bg-neutral-600 rounded-2xl my-10">
          <View className="w-4/5">
            <Text className="text-white text-xl font-semibold mb-3">
              Your order is on the way
            </Text>
            <Text className="text-white text-xs">
              Click here to track your order
            </Text>
          </View>
          <FontAwesome5 name="shipping-fast" size={50} color="white" />
        </Pressable>
      </Link>

      <Table className="mb-10 rounded-2xl overflow-hidden px-4 py-3 bg-white">
        <TableBody>
          {orderInfos.map((info) => (
            <TableRow className="border-0" key={`order-info-${info.value}`}>
              <TableData className="text-gray-500 text-sm px-0 font-normal">
                {info.title}
              </TableData>
              <TableData className="text-right text-sm px-0">
                {info.value}
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Accordion>
        <AccordionRow
          title={`Items ${order.items.length}`}
          content={
            <Table className="mb-10 rounded-xl overflow-hidden bg-white px-4 py-3">
              <TableBody>
                {order.items.map((orderItem, index, arr) => (
                  <TableRow
                    className={index !== arr.length - 1 ? 'border-0' : ''}
                    key={`cartitem-${orderItem.product.id}`}
                  >
                    <TableData className="text-gray-500 font-normal text-sm px-0">
                      {orderItem.product.title}
                    </TableData>

                    <TableData className="text-sm text-right px-0">
                      <View className="flex-row gap-4 items-center">
                        <Text className="mr-5">x{orderItem.quantity}</Text>
                        <Text>{getPriceDisplay(orderItem.product)}</Text>
                      </View>
                    </TableData>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableData className="text-gray-500 font-normal text-base px-0">
                    Total
                  </TableData>
                  <TableData className="text-right px-0">
                    {getPriceDisplay(
                      getTotal(order.items.map((orderItems) => orderItems)),
                    )}
                  </TableData>
                </TableRow>
              </TableFooter>
            </Table>
          }
        />
      </Accordion>
    </ScrollView>
  );
};

export default OrderDetails;
