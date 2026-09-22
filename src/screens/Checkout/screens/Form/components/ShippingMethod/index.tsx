import { Text } from '@/components/AppText';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { shippingMethods } from '@/constants/shipping';
import { useAppSelector } from '@/store/hooks';
import { ShipMethod } from '@/types';
import { MotiView } from 'moti';
import { Fragment, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

const ShippingMethod = ({
  onChange,
}: {
  onChange: (value: ShipMethod) => void;
}) => {
  const { orderInfo } = useAppSelector((store) => store.user);

  const [activeShippingMethod, setActiveShippingMethod] =
    useState<ShipMethod>('free');

  useEffect(() => {
    if (orderInfo) {
      setActiveShippingMethod(orderInfo.ship_method);
    }
  }, [orderInfo]);
  return (
    <View className="my-14">
      <Text className="font-medium text-2xl mb-9">Shipping method</Text>
      <VStack>
        <Divider />
        {shippingMethods.map((method, index) => (
          <Fragment key={method.value}>
            <Pressable
              onPress={() => {
                setActiveShippingMethod(method.value);
                onChange(method.value);
              }}
              className="flex-row items-center gap-5 py-5"
            >
              <View className="size-6 rounded-full">
                <MotiView
                  className="size-full rounded-full"
                  animate={{
                    borderWidth: activeShippingMethod === method.value ? 8 : 0,
                    borderColor: '#0f766e',
                  }}
                  transition={{
                    type: 'timing',
                    duration: 200,
                  }}
                />
              </View>
              <View>
                <View className="flex-row gap-3 mb-5">
                  <Text className="w-20 font-medium">
                    {method.price} {method.price !== 'Free' && 'AZN'}
                  </Text>
                  <Text className="text-gray-600">{method.title}</Text>
                </View>
                <Text className="text-gray-400">{method.subtitle}</Text>
              </View>
            </Pressable>
            {index !== shippingMethods.length - 1 && <Divider />}
          </Fragment>
        ))}
        <Divider />
      </VStack>
    </View>
  );
};

export default ShippingMethod;
