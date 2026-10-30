import { authAxiosInstance } from '@/api/auth';
import InputError from '@/components/InputError';
import { MovingDotLoader } from '@/components/MovingDotLoader';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { colors } from '@/constants/style';
import { showToast } from '@/helpers/toast';
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from '@/schemas/forgotpassword.schema';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { createURL } from 'expo-linking';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text } from 'react-native';

const MailIcon = () => (
  <Ionicons name="mail-outline" size={24} color={colors['slate-gray']} />
);

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting, isSubmitSuccessful, isDirty },
    setError,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const toast = useToast();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordResetReqSent, setIsPasswordResetReqSent] =
    useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const redirectUrl = createURL('/auth/resetpassword').replace('///', '//');

    try {
      await authAxiosInstance.post(
        'recover',
        {
          email: data.email,
        },
        {
          params: {
            redirect_to: redirectUrl,
          },
        },
      );

      showToast(
        toast,
        {
          description:
            'Reset password link has been sent to your email. Please check your inbox.',
        },
        { action: 'success', duration: 5000 },
      );
      setIsPasswordResetReqSent(true);
    } catch (error) {
      showToast(
        toast,
        {
          description:
            'An uncexpected error while sending password reset email',
        },
        { action: 'error' },
      );
      console.error(
        'AN ERROR OCCURED WHILE RESET PASSWORD REQUEST SENT',
        error,
      );
    }
  });

  return (
    <ScrollView
      className="pt-28 container h-full border-red-500"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-semibold mb-5">Forgot password?</Text>
      <Text className="text-lg/relaxed mb-14">
        Enter email associated with your account and we’ll send and email with
        intructions to reset your password
      </Text>

      <Controller
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <FormControl
            isInvalid={!!error}
            isDisabled={isPasswordResetReqSent || isLoading || isSubmitting}
            isRequired={true}
          >
            <Input variant="underlined" className="h-[59px] pl-2">
              {value === '' && (
                <InputSlot>
                  <InputIcon as={MailIcon} />
                </InputSlot>
              )}
              <InputField
                onChangeText={onChange}
                value={value}
                placeholder="enter your email here"
                className="placeholder:font-thin text-black pl-7 pr-4"
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                submitBehavior="submit"
              />
            </Input>
            {error && <InputError errorMessage={error.message} />}
          </FormControl>
        )}
      />

      {(isDirty && !isFocused) ||
        (!isPasswordResetReqSent && (
          <Pressable
            disabled={isSubmitting}
            className="bg-black w-3/5 py-3 rounded-full m-auto mt-28"
            onPress={onSubmit}
          >
            {isLoading || isSubmitting ? (
              <MovingDotLoader dotClassName="bg-white" />
            ) : (
              <Text className="text-xl font-medium text-white text-center">
                Send reset link
              </Text>
            )}
          </Pressable>
        ))}
    </ScrollView>
  );
};

export default ForgotPassword;
