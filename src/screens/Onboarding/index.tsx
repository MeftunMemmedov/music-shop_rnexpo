import { OnboardingImg0 } from '@/assets/images';
import { motify, Text } from 'moti';
import { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import OnboardingSlider from './components/OnboardingSlider';

const MotiTouchableOpacity = motify(TouchableOpacity)();

const Onboarding = () => {
  const [isStarted, setIsStarted] = useState<boolean>(false);

  if (!isStarted)
    return (
      <View className="relative h-full">
        <Image source={OnboardingImg0} className="size-full object-cover" />
        <View className="absolute inset-0 bg-black/45">
          <View className="mt-auto w-full">
            <Text
              className="text-center text-white text-3xl font-semibold mb-3"
              from={{ translateY: 30, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 200, delay: 50 }}
            >
              Welcome to Music Shop!
            </Text>
            <Text
              className="text-center text-white text-xl mb-14"
              from={{ translateY: 30, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 200, delay: 100 }}
            >
              The home of music
            </Text>
            <MotiTouchableOpacity
              onPress={() => setIsStarted(true)}
              className="py-4 border mb-28 w-56 border-white bg-white/25 rounded-full m-auto"
              from={{ translateY: 30, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 200, delay: 150 }}
            >
              <Text className="text-center m-auto text-white font-medium">
                Get Started
              </Text>
            </MotiTouchableOpacity>
          </View>
        </View>
      </View>
    );

  return <OnboardingSlider />;
};

export default Onboarding;
