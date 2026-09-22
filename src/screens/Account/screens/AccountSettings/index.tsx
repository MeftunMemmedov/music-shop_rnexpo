import { ProfilePic } from '@/assets/images';
import { Text } from '@/components/AppText';
import FormStack from '@/components/FormStack';
import { useToast } from '@/components/ui/toast';
import { showToast } from '@/helpers/toast';
import { EditUserInput, editUserSchema } from '@/schemas/edituser.schema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { editUserInfo } from '@/store/user/asyncThunks';
import { FormFields } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, ScrollView, View } from 'react-native';

const AccountSettings = () => {
  const dispatch = useAppDispatch();
  const { info } = useAppSelector((store) => store.user);

  const { isConnected } = useNetInfo();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    setError,
  } = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      user_id: info?.user_id,
      email: info?.email || '',
      data: {
        user_name: info?.user_name || '',
      },
      provider: info?.app_metadata?.provider,
    },
  });

  const toast = useToast();

  const onSubmit = handleSubmit(async (input: EditUserInput) => {
    try {
      const netStatus = await NetInfo.fetch();

      if (!netStatus.isConnected || !netStatus.isInternetReachable) {
        showToast(
          toast,
          {
            description: 'Please check your connection and try again!',
          },
          {
            id: 'edt-usr-inf-err',
            action: 'error',
          },
        );
        return;
      }

      if (!isDirty) {
        showToast(
          toast,
          {
            description: 'Informations cannot be the same!',
          },
          {
            id: `${info?.user_name}-same-inf-err`,
            action: 'error',
          },
        );
        return;
      }

      const editUserInfoRes = await dispatch(
        editUserInfo({ input, prevInfo: info }),
      );

      if (editUserInfo.rejected.match(editUserInfoRes)) {
        showToast(
          toast,
          { description: 'An error occured while updating quantity!' },
          {
            id: `${info?.user_name} edt-usr-err`,
            action: 'error',
          },
        );

        return;
      }

      showToast(
        toast,
        { description: 'User information updated successfully!' },
        {
          id: `${info?.user_name}-edt-usrinf-scs`,
          action: 'success',
        },
      );

      router.back();
    } catch (err) {
      if (err instanceof AxiosError)
        setError('root', {
          message:
            err?.response?.data?.msg || err.message || 'AN ERROR OCCURED',
        });
    }
  });

  const [focused, setFocused] = useState<boolean>(false);

  const formFields: FormFields<EditUserInput> = [
    {
      label: 'Email',
      name: 'email',
      readonly: info?.app_metadata?.provider === 'google',
    },
    {
      label: 'Username',
      name: 'data.user_name',
    },
  ];

  return (
    <ScrollView contentContainerClassName="container">
      <View className="pt-20 pb-32">
        <View className="max-md:w-1/2 w-1/3 aspect-square relative m-auto">
          <Image
            source={ProfilePic}
            width={63}
            height={63}
            className="rounded-full size-full"
          />
          <Pressable className="size-11 rounded-full absolute -bottom-3 -right-3 bg-black flex-row items-center justify-center">
            <MaterialIcons name="photo-camera" size={18} color="white" />
          </Pressable>
        </View>
      </View>
      <FormStack
        setFocused={setFocused}
        onSubmit={onSubmit}
        fields={formFields}
        control={control}
        disabled={isSubmitting || isConnected === false}
      />
      {isDirty && !focused && (
        <Pressable
          disabled={isSubmitting || isConnected === false}
          className="bg-black w-3/5 py-3 rounded-full m-auto my-32"
          onPress={onSubmit}
        >
          <Text className="text-xl font-medium text-white text-center">
            Save change
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default AccountSettings;
