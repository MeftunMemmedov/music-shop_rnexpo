import { AnimatedText } from '@/components/AnimatedText';
import { MotiPressable } from '@/components/Motified';
import { MovingDotLoader } from '@/components/MovingDotLoader';
import { AUTH_SKIP_KEY } from '@/constants/storagekeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { MotiView } from 'moti';
import { ReactNode, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SocialAuth from './components/SocialAuth';

interface Props {
  title: string;
  question: string;
  linkText: string;
  submitBtnTitle: 'SIGN IN' | 'SIGN UP';
  authLink: '/auth/signin' | '/auth/signup';
  children: ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
  isSubmitting: boolean;
  focused: boolean;
}

const AuthLayout = ({
  children,
  title,
  onSubmit,
  submitBtnTitle,
  question,
  authLink,
  linkText,
  isLoading,
  isSubmitting,
  focused,
}: Props) => {
  const [initAuthSkipped, setInitAuthSkipped] = useState<boolean>(false);

  const saveAuthSkipState = async () => {
    try {
      await AsyncStorage.setItem(AUTH_SKIP_KEY, 'skipped');
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE SAVING SKIP_AUTH STATE', error);
    }
  };

  useEffect(() => {
    const getAuthSkipState = async () => {
      try {
        const skipState = await AsyncStorage.getItem(AUTH_SKIP_KEY);

        setInitAuthSkipped(skipState === 'skipped');
      } catch (error) {
        console.error(error);
        setInitAuthSkipped(false);
      }
    };

    getAuthSkipState();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerClassName="container pb-10"
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={60}
      extraHeight={100}
    >
      <AnimatedText
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        className="w-1/2 md:pb-[10%] pb-[20%] md:pt-[10%] pt-[30%] text-3xl/loose font-semibold"
      >
        {title}
      </AnimatedText>
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
      >
        {children}
      </MotiView>
      {!focused && (
        <View>
          <MotiPressable
            from={{ opacity: 0, translateX: 60 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            onPress={onSubmit}
            disabled={isLoading || isSubmitting}
            className="mt-9 w-36 aspect-[148/53] m-auto rounded-full bg-charcoal flex-row items-center justify-center"
          >
            {isSubmitting || isLoading ? (
              <MovingDotLoader dotClassName="bg-white" />
            ) : (
              <AnimatedText className="text-white font-semibold text-lg">
                {submitBtnTitle}
              </AnimatedText>
            )}
          </MotiPressable>

          <SocialAuth />

          <AnimatedText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            className="text-center text-lg"
          >
            {question}?{' '}
            <Link className="underline" href={authLink}>
              {linkText}
            </Link>
          </AnimatedText>

          {!initAuthSkipped && (
            <Pressable
              className="my-3 m-auto"
              onPress={() => {
                saveAuthSkipState();
                router.replace('/');
              }}
            >
              <AnimatedText className="underline">Skip and start</AnimatedText>
            </Pressable>
          )}
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default AuthLayout;
