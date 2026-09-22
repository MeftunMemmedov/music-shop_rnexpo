import { Text } from '@/components/AppText';
import { useResponsive } from '@/hooks';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Foundation from '@expo/vector-icons/Foundation';
import { MotiView } from 'moti';
import { View } from 'react-native';

const CheckoutSteps = ({ active = 0 }: { active?: number }) => {
  const { isTablet } = useResponsive();
  const renderDots = () => (
    <View className="px-5 flex-row md:gap-3 gap-2">
      {Array.from({ length: isTablet ? 9 : 5 }, (_, index) => (
        <Entypo
          name="dot-single"
          size={10}
          key={`checkout-step-dot-${index}`}
          color="gray"
        />
      ))}
    </View>
  );

  return (
    <>
      <View className="flex-row items-center mx-auto my-3">
        <FontAwesome6 name="location-dot" size={24} color="black" />
        {renderDots()}
        <Foundation
          name="credit-card"
          size={35}
          color={active > 0 ? 'black' : 'gray'}
        />
        {renderDots()}
        <FontAwesome
          name="check-circle"
          size={28}
          color={active === 2 ? 'black' : 'gray'}
        />
      </View>
      {active !== 2 && (
        <MotiView
          from={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="mt-4 mb-10"
        >
          <Text className="font-light">STEP {active + 1}</Text>
          <Text className="text-4xl font-medium">
            {active === 0 ? 'Shipping' : 'Payment'}
          </Text>
        </MotiView>
      )}
    </>
  );
};

export default CheckoutSteps;
