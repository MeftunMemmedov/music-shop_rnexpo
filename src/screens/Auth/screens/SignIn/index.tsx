import { Text } from '@/components/AppText';
import FormStack from '@/components/FormStack';
import { LoginInput, loginSchema } from '@/schemas/login.schema';
import { useAppDispatch } from '@/store/hooks';
import { signUserIn } from '@/store/user/asyncThunks';
import { FormFields } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import Netinfo from '@react-native-community/netinfo';
import { AxiosError } from 'axios';
import { Link, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/AuthLayout';

const SignIn = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [focused, setFocused] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formFields: FormFields<LoginInput> = [
    {
      label: 'Enter your email',
      name: 'email',
      required: true,
    },
    {
      label: 'Enter your password',
      name: 'password',
      required: true,
    },
  ];

  const onSubmit = handleSubmit(async (input: LoginInput) => {
    const netinfo = await Netinfo.fetch();

    if (!netinfo.isConnected || !netinfo.isInternetReachable) {
      setError('root', {
        message: 'Please check your connection and try again.',
      });
      return;
    }

    try {
      await dispatch(signUserIn(input)).unwrap();

      router.push('/(drawer)/(tabs)');
    } catch (err) {
      if (err instanceof AxiosError)
        setError('root', {
          message:
            err?.response?.data?.msg || err.message || 'AN ERROR OCCURED',
        });
    }
  });

  return (
    <AuthLayout
      title="Log into your account"
      submitBtnTitle="SIGN IN"
      onSubmit={onSubmit}
      focused={focused}
      question="Don’t have an account"
      authLink="/auth/signup"
      linkText="Sign Up"
      isLoading={isLoading}
      isSubmitting={isSubmitting}
    >
      {errors.root && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 500,
          }}
          className="bg-red-500 rounded-md py-3 mb-4"
        >
          <Text className="text-center text-white font-semibold">
            {errors.root.message}
          </Text>
        </MotiView>
      )}
      <FormStack
        setFocused={setFocused}
        onSubmit={onSubmit}
        disabled={isSubmitting}
        fields={formFields}
        control={control}
        className="mb-8"
      />
      <Link href={'/auth/forgotpassword'} className="ml-auto">
        <Text>Forgot password?</Text>
      </Link>
    </AuthLayout>
  );
};

export default SignIn;
