import { authBaseURL } from '@/api/auth';
import { getUserData } from '@/api/auth/helpers';
import { Text } from '@/components/AppText';
import { tokenActions } from '@/helpers/auth';
import { useAppDispatch } from '@/store/hooks';
import { editUserInfo, getUser } from '@/store/user/asyncThunks';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createURL } from 'expo-linking';
import {
  maybeCompleteAuthSession,
  openAuthSessionAsync,
} from 'expo-web-browser';
import { Pressable, View } from 'react-native';

maybeCompleteAuthSession();

const SocialAuth = () => {
  const dispatch = useAppDispatch();

  const authByGoogle = async () => {
    try {
      const redirectUrl = createURL('/');
      const authUrl = `${authBaseURL}authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
      const res = await openAuthSessionAsync(authUrl, redirectUrl);

      if (res.type === 'success' && res.url) {
        const hashData = res.url.split('#')[1];
        if (hashData) {
          const params = new URLSearchParams(hashData);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const expires_in = params.get('expires_in');

          if (access_token && refresh_token && expires_in) {
            await tokenActions.saveTokens(
              access_token,
              refresh_token,
              +expires_in,
            );

            const userData = await getUserData();

            await dispatch(
              editUserInfo({
                input: {
                  email: userData.email,
                  user_id: userData.id,
                  data: { user_name: userData.user_metadata?.name || 'User' },
                  provider: userData.app_metadata!.provider,
                },
                prevInfo: {
                  user_id: userData.id,
                  email: userData.email,
                  user_name: 'User',
                  id: userData.id,
                  app_metadata: {
                    provider: userData.app_metadata?.provider || 'google',
                  },
                },
              }),
            ).unwrap();

            await dispatch(getUser());
          }
        }
      }
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE GOOGLE AUTH', error);
    }
  };
  return (
    <View className="my-12">
      <Text className="text-center text-gray-400 mb-5">or continue with</Text>
      <View className="flex-row justify-center gap-3">
        <Pressable
          onPress={authByGoogle}
          className="size-14 rounded-full border border-gray-200"
        >
          <FontAwesome
            name="google"
            size={24}
            color="black"
            className="m-auto"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default SocialAuth;
