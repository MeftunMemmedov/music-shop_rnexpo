import FormStack from '@/components/FormStack';
import { CheckoutInput, checkoutSchema } from '@/schemas/checkout.schema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FormFields, ShipMethod } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNetInfo } from '@react-native-community/netinfo';
import { useFocusEffect, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, View } from 'react-native';
import CartInfo from './components/CartInfo';

import { AnimatedText } from '@/components/AnimatedText';
import { setOrderInfo } from '@/store/user';
import { randomUUID } from 'expo-crypto';
import { useEffect, useState } from 'react';
import CheckoutSteps from '../../components/CheckoutSteps';
import ShippingMethod from './components/ShippingMethod';

const CheckoutForm = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isConnected } = useNetInfo();

  const { info, orderInfo } = useAppSelector((store) => store.user);

  const { items, count } = useAppSelector((store) => store.cart);

  const [orderId] = useState<string>(() => randomUUID());

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      id: orderId,
      user_id: info?.user_id,
      user_name: orderInfo?.user_name || info?.user_name || '',
      email: orderInfo?.email || info?.email || '',
      phone: orderInfo?.phone || '',
      address: orderInfo?.address || '',
      note: orderInfo?.note || '',
      ship_method: orderInfo?.ship_method || 'free',
    },
  });

  const formFields: FormFields<CheckoutInput> = [
    {
      label: 'User name',
      name: 'user_name',
      required: true,
    },
    {
      label: 'Email',
      name: 'email',
      required: true,
    },
    {
      label: 'Phone',
      name: 'phone',
      required: true,
    },
    {
      label: 'Address',
      name: 'address',
      required: true,
    },
    {
      label: 'Note',
      name: 'note',
    },
  ];

  useEffect(() => {
    router.setParams({ title: 'Checkout' });
  }, []);

  useFocusEffect(() => {
    if (count === 0 && orderInfo === null) {
      router.replace('/cart');
    }
  });

  const noCartItems = !items || items.length === 0;

  if (noCartItems) return null;

  const onShipMethodChange = (value: ShipMethod) => {
    setValue('ship_method', value);
  };

  const onSubmit = handleSubmit((data: CheckoutInput) => {
    dispatch(setOrderInfo(data));
    router.push('/checkout/payment');
  });

  return (
    <ScrollView contentContainerClassName="container">
      <CheckoutSteps />

      <View className="">
        {errors.root && (
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            className="bg-red-500 rounded-md py-3 mb-4"
          >
            <AnimatedText className="text-center text-white font-semibold">
              {errors.root.message}
            </AnimatedText>
          </MotiView>
        )}
        <FormStack
          onSubmit={onSubmit}
          fields={formFields}
          control={control}
          disabled={isSubmitting || isConnected === false}
        />

        <ShippingMethod onChange={onShipMethodChange} />

        <CartInfo />

        <Pressable
          onPress={onSubmit}
          disabled={isConnected === false}
          className="w-11/12 py-5 bg-charcoal m-auto rounded-full mb-10"
        >
          <AnimatedText className="text-center text-white text-xl font-medium">
            Continue to payment
          </AnimatedText>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CheckoutForm;
