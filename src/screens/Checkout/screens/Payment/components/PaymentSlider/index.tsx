import {
  AlipayLogo,
  AmexLogo,
  CreditCard1,
  MasterCardLogo,
  PaypalLogo,
  VisaLogo,
} from '@/assets/images';
import { Text } from '@/components/AppText';
import { MotiPressable } from '@/components/Motified';
import React, { useState } from 'react';
import { FlatList, Image, View } from 'react-native';

const PaymentSlider = ({ disabled }: { disabled: boolean }) => {
  const [activeCreditCardIndex, setActiveCreditCardIndex] = useState<number>(0);
  const creditCards = [CreditCard1, CreditCard1, CreditCard1];

  const paymentVariants = [
    PaypalLogo,
    VisaLogo,
    MasterCardLogo,
    AlipayLogo,
    AmexLogo,
  ];
  return (
    <View className="flex-1">
      <View className="flex-row justify-between mt-11 mb-6">
        <Text
          className={`font-semibold text-xl ${disabled ? 'text-gray-400' : ''}`}
        >
          Choose your card
        </Text>

        {/* <Pressable disabled={disabled}>
          <Text className="font-semibold text-red-500">Add new +</Text>
        </Pressable> */}
      </View>
      <FlatList
        className="flex-1 mb-9 pt-4"
        keyExtractor={(_, index) => `creditcard-${index}`}
        horizontal
        scrollEnabled={!disabled}
        showsHorizontalScrollIndicator={false}
        data={creditCards}
        renderItem={({ item, index }) => (
          <MotiPressable
            animate={{ scale: activeCreditCardIndex === index ? 1.1 : 1 }}
            onPress={() => setActiveCreditCardIndex(index)}
            className="w-96 aspect-[734/444] relative"
            disabled={disabled}
          >
            {disabled && (
              <View className="size-full absolute top-0 left-0 bg-white/50 z-10"></View>
            )}
            <Image
              source={item}
              className="size-full object-contain"
              style={{ objectFit: 'contain' }}
            />
          </MotiPressable>
        )}
      />
      <View>
        <Text className={`mb-5 ${disabled ? 'text-gray-400' : ''}`}>
          or check out with
        </Text>
        <View className="flex-row gap-5 justify-center">
          {paymentVariants.map((variantLogo, index) => (
            <MotiPressable
              key={`payment-variant-${index}`}
              disabled={disabled}
              className={`w-16 relative border border-gray-200 rounded-md aspect-[50/34] ${index === paymentVariants.length - 1 ? 'bg-[#1F72CD]' : ''}`}
            >
              {disabled && (
                <View className="size-full absolute top-0 left-0 bg-white/50 z-10"></View>
              )}
              <Image source={variantLogo} className="m-auto " />
            </MotiPressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PaymentSlider;
