import { authAxiosInstance } from '@/api/auth';
import InputError from '@/components/InputError';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { colors } from '@/constants/style';
import { showToast } from '@/helpers/toast';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@/schemas/forgotpassword.schema';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLinkingURL } from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text } from 'react-native';

const LockIcon = () => (
  <EvilIcons name="lock" size={24} color={colors['slate-gray']} />
);

const ResetPassword = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isLoading, isSubmitting, isDirty },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const toast = useToast();
  const url = useLinkingURL();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await authAxiosInstance.put(
        'user',
        { password: data.newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      showToast(
        toast,
        { description: 'Your password has been updated successfully!' },
        { action: 'success' },
      );

      setTimeout(() => {
        router.replace('/auth/signin');
      }, 1000);
    } catch (error) {
      showToast(
        toast,
        { description: 'An uncexpected error while resetting password' },
        { action: 'error' },
      );
      console.error('AN ERROR OCCURED WHILE RESET PASSWORD', error);
    }
  });

  useEffect(() => {
    if (url) {
      const hash = url.split('#')[1];
      if (hash) {
        const urlParams = new URLSearchParams(hash);
        const access_token = urlParams.get('access_token');
        const type = urlParams.get('type');

        if (access_token && type === 'recovery') {
          setAccessToken(access_token);
        }
      }
    }
  }, [url]);

  return (
    <ScrollView
      className="pt-28 container h-full border-red-500"
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-semibold mb-5">Reset your password</Text>
      <Text className="text-lg/relaxed mb-14">Enter your new password</Text>
      <Controller
        control={control}
        name="newPassword"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <FormControl
            isInvalid={!!error}
            isDisabled={isLoading || isSubmitting}
            isRequired={true}
            className="relative w-full"
          >
            <Input variant="underlined" className="h-[59px] pl-2">
              {value === '' && (
                <InputSlot>
                  <InputIcon as={LockIcon} />
                </InputSlot>
              )}
              <InputField
                onChangeText={onChange}
                value={value}
                placeholder="Your new password"
                className="placeholder:text-black placeholder:font-thin pl-7 pr-4"
                secureTextEntry={!isPasswordVisible}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  onBlur();
                  setIsFocused(false);
                }}
                submitBehavior="submit"
              />
            </Input>
            <Pressable
              focusable={false}
              className="absolute right-4 z-20 bottom-3"
              onPress={() => {
                setIsPasswordVisible((prevState) => !prevState);
              }}
            >
              <AntDesign
                name={isPasswordVisible ? 'eye' : 'eye-invisible'}
                size={24}
                color="black"
              />
            </Pressable>
            {error && <InputError errorMessage={error.message} />}
          </FormControl>
        )}
      />

      {isDirty && !isFocused && (
        <Pressable
          disabled={isSubmitting}
          className="bg-black w-3/5 py-3 rounded-full m-auto mt-28"
          onPress={onSubmit}
        >
          <Text className="text-xl font-medium text-white text-center">
            Reset Password
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default ResetPassword;
