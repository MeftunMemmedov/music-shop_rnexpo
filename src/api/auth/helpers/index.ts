import { axiosInstance } from '@/api';
import { getData, patchData } from '@/api/helpers';
import { syncUserCart, syncUserWishlist } from '@/api/helpers/inventory';
import { postPushToken } from '@/api/helpers/notification';
import { USER_INFO_KEY } from '@/constants/storagekeys';
import { tokenActions } from '@/helpers/auth';
import { EditUserInput } from '@/schemas/edituser.schema';
import { LoginInput } from '@/schemas/login.schema';
import {
  CartItem,
  SignInResponse,
  User,
  UserAuthState,
  WishlistItem,
} from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAxiosInstance, authBaseURL } from '..';

export const signIn = async (
  input: LoginInput,
  inventory: {
    cart: { items: CartItem[] | null; count: number };
    wishlist: { items: WishlistItem[] | null; count: number };
  },
) => {
  try {
    const { data } = await authAxiosInstance.post<SignInResponse>(
      'token?grant_type=password',
      input,
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      user: { id: user_id },
    } = data;

    await tokenActions.saveTokens(access_token, refresh_token, expires_in);

    const { cart, wishlist } = inventory;

    if (cart.count > 0) {
      await syncUserCart(cart.items!, user_id);
    }

    if (wishlist.count > 0) {
      await syncUserWishlist(wishlist.items!, user_id);
    }

    await postPushToken(user_id);
  } catch (error) {
    console.error(`AN ERROR OCCURED WHILE SIGNING IN`, error);
    throw error;
  }
};

export const getUserData = async (): Promise<User> => {
  const { data: userData } = await axiosInstance.get<User>('user', {
    baseURL: authBaseURL,
  });

  return userData;
};

export const fetchUser = async (): Promise<UserAuthState | null> => {
  const access_token = await tokenActions.getToken('access');

  if (!access_token) return null;

  try {
    const storedUserStorage = await AsyncStorage.getItem(USER_INFO_KEY);
    const storedUser: User | null = storedUserStorage
      ? JSON.parse(storedUserStorage)
      : null;

    if (storedUser)
      return {
        isAuth: true,
        user: storedUser,
      };

    const userData = await getUserData();

    const user = await getData<User>('shop_profiles', {
      select: '*',
      user_id: `eq.${userData.id}`,
    });

    const userInfo = {
      ...user,
      app_metadata: { provider: userData.app_metadata!.provider || 'email' },
    };

    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    return {
      isAuth: !!userData,
      user: userInfo,
    };
  } catch (error) {
    console.error('AN ERROR OCCURED WHILE GETTING USER', error);
    return null;
  }
};

export const editUser = async (input: EditUserInput) => {
  try {
    const authUpdate = await axiosInstance.put(
      'user',
      {
        email: input.email,
        data: {
          user_name: input.data.user_name,
        },
      },
      {
        baseURL: authBaseURL,
      },
    );

    const tableUpdate = await patchData(
      'shop_profiles',
      {
        user_name: input.data.user_name,
        email: input.email,
      },
      {
        user_id: `eq.${input.user_id}`,
      },
    );

    await Promise.all([authUpdate, tableUpdate]);
  } catch (error) {
    console.error('AN ERROR OCCURED WHILE UPDATING USER', error);
    throw error;
  }
};
