import { AnimatedText } from '@/components/AnimatedText';
import { colors } from '@/constants/style';
import { useResponsive } from '@/hooks';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { View } from 'moti';
import { useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';
import CheckoutSteps from '../../components/CheckoutSteps';

const CheckoutComplete = () => {
  const router = useRouter();
  const { width, isTablet } = useResponsive();

  useEffect(() => {
    router.setParams({ title: 'Completed' });
  }, []);
  return (
    <ScrollView
      className="container pt-28"
      showsVerticalScrollIndicator={false}
    >
      <CheckoutSteps active={2} />
      <AnimatedText
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        className="text-3xl font-medium mb-20 mt-10"
      >
        Order Completed
      </AnimatedText>

      <View
        className="m-auto mb-14"
        from={{ opacity: 0, translateX: 90 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 800 }}
      >
        <MaterialCommunityIcons
          name="cart-check"
          size={width / (isTablet ? 6 : 2)}
          color={colors.charcoal}
        />
      </View>

      <AnimatedText
        className="text-center text-lg text-charcoal"
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 100 }}
      >
        Thank you for your purchase.
      </AnimatedText>
      <AnimatedText
        className="text-center text-lg mb-24 text-charcoal"
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 150 }}
      >
        You can view your order in ‘My Orders’ section in your account page.
      </AnimatedText>

      <Pressable
        onPress={() => router.push('/')}
        className="w-11/12 py-5 bg-charcoal m-auto rounded-full mb-10"
      >
        <AnimatedText className="text-center text-white text-xl font-medium">
          Continue Shopping
        </AnimatedText>
      </Pressable>
    </ScrollView>
  );
};

export default CheckoutComplete;
