import { deleteData, postData } from '@/api/helpers';
import { Text } from '@/components/AppText';
import { MotiPressable } from '@/components/Motified';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Table, TableBody, TableData, TableRow } from '@/components/ui/table';
import { shippingMethods } from '@/constants/shipping';
import { colors } from '@/constants/style';
import { getPriceDisplay } from '@/helpers/product';
import { useCart } from '@/hooks';
import {
  CheckoutPaymentInput,
  checkoutPaymentSchema,
} from '@/schemas/checkout.schema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrderInfo } from '@/store/user';
import { PayMethod } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { JSX, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, View } from 'react-native';
import CheckoutSteps from '../../components/CheckoutSteps';
import PaymentSlider from './components/PaymentSlider';

const Payment = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { orderInfo, info } = useAppSelector((store) => store.user);
  const { total, items } = useAppSelector((store) => store.cart);

  const { handleDeleteMultipleCartItems } = useCart();

  const [activePaymentMethod, setActivePaymentMethod] =
    useState<PayMethod>('Credit Card');

  const {
    setValue,
    setError,
    handleSubmit,
    control,
    formState: { isSubmitting, isLoading },
  } = useForm<CheckoutPaymentInput>({
    resolver: zodResolver(checkoutPaymentSchema),
    defaultValues: {
      pay_method: 'Credit Card',
      agreed_terms: false,
    },
  });

  const orderItems = items?.map((cartItem) => ({
    product: cartItem.product.id,
    quantity: cartItem.quantity,
  }));

  useEffect(() => {
    router.setParams({ title: 'Checkout' });
  }, []);

  if (!orderInfo || !orderItems) return null;

  const onSubmit = handleSubmit(async (data: CheckoutPaymentInput) => {
    const { pay_method } = data;
    const { id, user_id, address, phone, note, user_name, email, ship_method } =
      orderInfo;

    try {
      await postData('shop_orders', {
        id,
        user_id,
        user_name,
        email,
        address,
        phone,
        note,
        ship_method,
        pay_method,
        status: 'pending',
      });

      try {
        const ordersPromises = orderItems?.map((orderItem) => {
          const { product, quantity } = orderItem;
          return postData('shop_orderedproducts', {
            user_id,
            order: id,
            product,
            quantity,
          });
        });

        if (ordersPromises) {
          await Promise.all(ordersPromises);
        }

        const orderProductIds = orderItems?.map(
          (orderItem) => orderItem.product,
        );

        if (orderProductIds && orderProductIds.length > 0) {
          await handleDeleteMultipleCartItems(orderProductIds, info!.user_id);
        }
        dispatch(setOrderInfo(null));
        router.replace('/checkout/complete');
      } catch (innerError) {
        await deleteData('shop_orders', { id: `eq.${id}` });
        throw new Error('AN UNEXPECTED ERROR WHILE CHECKOUT');
      }
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE CHECKOUT', error);
      setError('root', { message: 'AN ERROR OCCURED WHILE CHECKOUT' });
    }
  });

  const disabled = isSubmitting || isLoading;

  const paymentMethods: { title: PayMethod; icon: JSX.Element }[] = [
    {
      title: 'Cash',
      icon: (
        <MaterialCommunityIcons
          name="cash"
          size={60}
          color={activePaymentMethod === 'Cash' ? 'white' : colors['charcoal']}
          className="m-auto h-14"
        />
      ),
    },
    {
      title: 'Credit Card',
      icon: (
        <Foundation
          name="credit-card"
          size={60}
          color={
            activePaymentMethod === 'Credit Card' ? 'white' : colors['charcoal']
          }
          className="m-auto h-14"
        />
      ),
    },
  ];

  const ship_method = shippingMethods.find(
    (shipMethod) => shipMethod.value === orderInfo.ship_method,
  );
  return (
    <ScrollView contentContainerClassName="container">
      <CheckoutSteps active={1} />
      <View className="flex-row justify-center gap-5">
        {paymentMethods.map((method) => (
          <MotiPressable
            onPress={() => {
              setActivePaymentMethod(method.title);
              setValue('pay_method', method.title);
            }}
            key={method.title}
            className={` w-56 items-center justify-center rounded-lg shadow-md ${activePaymentMethod === method.title ? 'bg-charcoal' : 'bg-white'}`}
            style={{ aspectRatio: '94/64' }}
          >
            <View>
              {method.icon}
              <Text
                className={`text-center ${activePaymentMethod === method.title ? 'text-white' : 'text-charcoal'}`}
              >
                {method.title}
              </Text>
            </View>
          </MotiPressable>
        ))}
      </View>
      {activePaymentMethod === 'Cash' && (
        <View className="flex-row items-center gap-2 mt-5">
          <Feather name="alert-circle" size={20} color="black" />
          <Text>You will pay the courier in cash upon delivery.</Text>
        </View>
      )}
      <PaymentSlider disabled={activePaymentMethod !== 'Credit Card'} />
      <Table className="w-full my-10 rounded-t-lg bg-white">
        <TableBody>
          <TableRow className="py-4">
            <TableData>Product Price</TableData>
            <TableData className="text-center">
              {getPriceDisplay(total)}
            </TableData>
          </TableRow>
          {ship_method && (
            <>
              <TableRow className="py-4">
                <TableData>Shipping</TableData>
                <TableData className="text-sm md:text-base md:text-center">
                  {ship_method.title} /{' '}
                  {ship_method.price === 'Free'
                    ? 'Free'
                    : getPriceDisplay(Number(ship_method?.price))}
                </TableData>
              </TableRow>
              <TableRow className="py-4 border-b-0">
                <TableData>Subtotal</TableData>
                <TableData className="text-center">
                  {getPriceDisplay(
                    total +
                      (ship_method.price === 'Free'
                        ? 0
                        : Number(+ship_method.price)),
                  )}
                </TableData>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
      <View className="px-5 mb-20">
        <Controller
          control={control}
          name="agreed_terms"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              <Checkbox
                value="terms_agreed"
                isChecked={value}
                isDisabled={disabled}
                onChange={onChange}
                size="md"
              >
                <CheckboxIndicator className="rounded-none data-[checked=true]:border-green-600 border-muted data-[checked=true]:bg-green-600">
                  <CheckboxIcon
                    classNameColor="white"
                    className="m-auto"
                    as={() => <AntDesign name="check" color="white" />}
                  />
                </CheckboxIndicator>
                <CheckboxLabel className="text-xl">
                  I agree to Terms and conditions
                </CheckboxLabel>
              </Checkbox>
              {error && (
                <FormControlError className="mt-1">
                  <FormControlErrorIcon
                    as={() => (
                      <Feather name="alert-circle" size={20} color="red" />
                    )}
                  />
                  <FormControlErrorText className="text-red-500 text-xs ml-1">
                    {error.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
        />
      </View>
      <Pressable
        disabled={disabled}
        onPress={onSubmit}
        className="w-11/12 py-5 bg-charcoal m-auto rounded-full mb-10"
      >
        <Text className="text-center text-white text-xl font-medium">
          Place my order
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Payment;
