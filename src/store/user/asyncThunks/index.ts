import { editUser, fetchUser, signIn } from '@/api/auth/helpers';
import { deleteData, getDataList, patchData } from '@/api/helpers';
import { USER_INFO_KEY } from '@/constants/storagekeys';
import { tokenActions } from '@/helpers/auth';
import { rootQueryClient } from '@/providers/TanstackQueryProvider';
import { EditUserInput } from '@/schemas/edituser.schema';
import { LoginInput } from '@/schemas/login.schema';
import type { RootState } from '@/store';
import { clearInventoryItems } from '@/store/cart/asyncThunks';
import { Comment, User, WishlistItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchUser();

      return res;
    } catch (error) {
      return rejectWithValue({ isAuth: false, info: null });
    }
  },
);

export const editUserInfo = createAsyncThunk(
  'user/editUserInfo',
  async (
    payload: {
      input: EditUserInput;
      prevInfo: User | null;
    },
    { rejectWithValue },
  ) => {
    const { input, prevInfo } = payload;
    try {
      await editUser(input);

      await AsyncStorage.setItem(
        USER_INFO_KEY,
        JSON.stringify({
          id: prevInfo?.id,
          user_id: prevInfo?.user_id,
          email: input.email,
          user_name: input.data.user_name,
          app_metadata: {
            provider: input.provider,
          },
        }),
      );
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE EDITIN USER INFO', error);
      return rejectWithValue(prevInfo);
    }
  },
);

export const getUserComments = createAsyncThunk(
  'user/getUserComments',
  async (_, { getState, rejectWithValue }) => {
    const { info } = (getState() as RootState).user;
    try {
      const res = await getDataList<Comment>('shop_comments', {
        select: 'id,comment,product(*),created_at',
        user_id: `eq.${info?.user_id}`,
      });

      return res;
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE GETTING USER COMMENTS', error);
      return rejectWithValue(null);
    }
  },
);

export const editUserComment = createAsyncThunk(
  'user/editUserComment',
  async (
    payload: {
      comment: string;
      commentId: string;
      prevComments: Comment[] | null;
    },
    { rejectWithValue },
  ) => {
    const { comment, commentId, prevComments } = payload;

    try {
      await patchData('shop_comments', { comment }, { id: `eq.${commentId}` });
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE EDITING COMMENT', error);
      return rejectWithValue(prevComments);
    }
  },
);

export const deleteUserComment = createAsyncThunk(
  'user/deleteUserComment',
  async (
    payload: { commentId: string; prevComments: Comment[] | null },
    { rejectWithValue },
  ) => {
    const { commentId, prevComments } = payload;
    try {
      await deleteData('shop_comments', {
        id: `eq.${commentId}`,
      });
    } catch (error) {
      rejectWithValue(prevComments);
    }
  },
);

export const logUserOut = createAsyncThunk('user/logUserOut', async () => {
  try {
    await tokenActions.removeTokens();

    rootQueryClient.removeQueries({ queryKey: ['wishlist'] });
  } catch (error) {
    console.error('ASYNCTHUNKERROR OCCURED WHILE LOGGING OUT');
  }
});

export const signUserIn = createAsyncThunk(
  'user/signUserIn',
  async (input: LoginInput, { getState, rejectWithValue, dispatch }) => {
    const { items, count } = (getState() as RootState).cart;

    const localWishlistItems =
      rootQueryClient.getQueryData<WishlistItem[]>(['wishlist', 'guest']) || [];

    try {
      const res = await signIn(input, {
        cart: { items, count },
        wishlist: {
          items: localWishlistItems,
          count: localWishlistItems.length,
        },
      });

      rootQueryClient.setQueryData(['wishlist', 'guest'], []);

      return res;
    } catch (error) {
      console.error('AN ASYNCTHUNK ERROR OCCURED WHILE SIGNIN IN');
      return rejectWithValue(error);
    } finally {
      dispatch(clearInventoryItems());
    }
  },
);
