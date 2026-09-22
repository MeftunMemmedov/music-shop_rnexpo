import LoadingScreen from '@/components/LoadingScreen';
import { AUTH_SKIP_KEY, ONBOARDING_KEY } from '@/constants/storagekeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

const RootScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [letGo, setLetGo] = useState<boolean>(false);

  useEffect(() => {
    const getOnboardingState = async () => {
      setIsLoading(true);
      try {
        const onboardingState = await AsyncStorage.getItem(ONBOARDING_KEY);
        const authSkipState = await AsyncStorage.getItem(AUTH_SKIP_KEY);

        setLetGo(onboardingState === 'complete' || authSkipState === 'skipped');
      } catch (error) {
        console.error(error);
        setLetGo(false);
      } finally {
        setIsLoading(false);
      }
    };
    getOnboardingState();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return <Redirect href={letGo ? '/(drawer)/(tabs)' : '/onboarding'} />;
};

export default RootScreen;
