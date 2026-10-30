import { USER_INFO_KEY } from '@/constants/storagekeys';
import { tokenActions } from '@/helpers/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccess } from '../auth';

let refreshPromise: ReturnType<typeof refreshAccess> | null = null;

export const getValidAccessToken = async (): Promise<string | null> => {
  const access_token = await tokenActions.getToken('access');
  const expires_in = await tokenActions.getToken('expires_in');
  const isExpired = expires_in
    ? Date.now() >= parseInt(expires_in, 10) - 10000
    : false;

  if (!access_token) return null;
  if (!isExpired) return access_token;

  const refresh_token = await tokenActions.getToken('refresh');
  if (!refresh_token) {
    await tokenActions.removeTokens();
    await AsyncStorage.removeItem(USER_INFO_KEY);
    return null;
  }

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAccess(refresh_token)
        .then(async (res) => {
          await tokenActions.saveTokens(
            res.access_token,
            res.refresh_token,
            res.expires_in,
          );
          return res;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return (await refreshPromise).access_token;
  } catch (err: any) {
    const status = err?.response?.status;

    const isRealtAuthRejection = status === 400 || status === 401;
    if (isRealtAuthRejection) {
      await tokenActions.removeTokens();
      await AsyncStorage.removeItem(USER_INFO_KEY);
      return null;
    }

    return access_token;
  }
};
