import {
  OnboardingImg1,
  OnboardingImg2,
  OnboardingImg3,
} from '@/assets/images';
import { MotiPressable } from '@/components/Motified';
import { ONBOARDING_KEY } from '@/constants/storagekeys';
import { useAppDispatch } from '@/store/hooks';
import { setFirstLaunch } from '@/store/user';
import { OnboardingSlide } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Text, View } from 'moti';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';

const OnboardingSlider = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const slides: OnboardingSlide[] = [
    {
      img: OnboardingImg1,
      title: 'Discover Your Sound',
      description:
        'Explore a wide range of instruments and find your perfect rhythm.',
    },
    {
      img: OnboardingImg2,
      title: 'Easy to Learn & Play',
      description:
        'Master your favorite instruments effortlessly with intuitive guides.',
    },
    {
      img: OnboardingImg3,
      title: 'Start Making Music!',
      description:
        'Unleash your inner artist and jump into your musical journey today.',
    },
  ];

  const isLastSlide = activeSlide === slides.length - 1;

  const saveOnboardingState = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'complete');
      dispatch(setFirstLaunch(true));
      router.replace('/auth/signin');
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE COMPLETING ONBOARD', error);
    }
  };

  useEffect(() => {
    const validateOnboarding = async () => {
      const onboardingStat = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (onboardingStat === 'complete') {
        router.replace('/');
      }
    };
    validateOnboarding();
  }, []);
  return (
    <View className="relative h-full">
      <View className="h-2/5 bg-[#464447] w-full mt-auto" />
      <View className="absolute inset-0 container">
        {slides[activeSlide].title && (
          <Text
            key={`title-${activeSlide}`}
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            className="mt-20 mb-4 text-center font-semibold text-xl"
          >
            {slides[activeSlide].title}
          </Text>
        )}
        {slides[activeSlide].description && (
          <Text
            key={`desc-${activeSlide}`}
            className="text-center font-medium mb-8"
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            {slides[activeSlide].description}
          </Text>
        )}
        {slides[activeSlide].img && (
          <View
            key={`img-${activeSlide}`}
            className="w-4/5 aspect-[261/368] mx-auto rounded-2xl overflow-hidden mb-14"
            from={{ translateX: 20, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <Image source={slides[activeSlide].img} className="size-full" />
          </View>
        )}

        <View className="flex-row justify-center gap-3">
          {Array.from({ length: slides.length }, (_, index) => (
            <View
              key={index}
              className={`size-2.5 border border-white rounded-full ${activeSlide === index ? 'bg-white' : ''}`}
            />
          ))}
        </View>
        <MotiPressable
          key={`btn-${activeSlide}`}
          onPress={() => {
            if (isLastSlide) {
              saveOnboardingState();
              return;
            }
            setActiveSlide((prevSlide) => prevSlide + 1);
          }}
          className="py-4 border mb-28 w-56 border-white bg-white/25 rounded-full m-auto"
          from={{ translateY: 30, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 200, delay: 150 }}
        >
          <Text className="text-center text-lg m-auto text-white font-medium ">
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </MotiPressable>
      </View>
    </View>
  );
};

export default OnboardingSlider;
