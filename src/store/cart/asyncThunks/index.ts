import { deleteData, patchData, postData } from '@/api/helpers';
import { getUserCart } from '@/api/helpers/inventory';
import { CART_KEY } from '@/constants/storagekeys';
import type { RootState } from '@/store';
import type { CartItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getCart = createAsyncThunk(
  'inventory/getCart',
  async (_, { getState, rejectWithValue }) => {
    const { isAuth } = (getState() as RootState).user;
    try {
      if (isAuth) {
        const userCart = getUserCart();
        return userCart;
      } else {
        const localCartStorage = await AsyncStorage.getItem(CART_KEY);
        const localCart: CartItem[] | null = localCartStorage
          ? JSON.parse(localCartStorage)
          : [];
        return localCart;
      }
    } catch (error) {
      console.error(
        `INVENTORY ERROR: AN ERROR OCCURED WHILE GETTING ${isAuth ? 'USER' : 'LOCAL'} CART`,
        error,
      );
      return rejectWithValue(null);
    }
  },
);

export const toggleCart = createAsyncThunk(
  'inventory/toggleCart',
  async (
    payload: { item: CartItem; user_id: string; prevItems: CartItem[] | null },
    thunk,
  ) => {
    const { getState, rejectWithValue } = thunk;

    const rootState = getState() as RootState;

    const { items } = rootState.cart;
    const { isAuth } = rootState.user;

    const { product, quantity } = payload.item;

    try {
      const existing = payload.prevItems?.some(
        (cartItem) => cartItem.product.id === product.id,
      );

      if (isAuth) {
        if (existing) {
          await deleteData('shop_cart', {
            product: `eq.${product.id}`,
          });
        } else {
          await postData('shop_cart', {
            product: product.id,
            user_id: payload.user_id,
            quantity,
          });
        }
      } else {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
      }
    } catch (error) {
      console.error(
        `INVENTORY ERROR: AN ERROR OCCURED WHILE TOGGLING ${isAuth ? 'USER' : 'LOCAL'} CART`,
        error,
      );
      return rejectWithValue(payload.prevItems);
    }
  },
);

export const updateQuantity = createAsyncThunk(
  'inventory/updateQuantity',
  async (
    payload: {
      productId: string;
      quantity: number;
      prevItems: CartItem[] | null;
    },
    thunk,
  ) => {
    const { getState, rejectWithValue } = thunk;

    const rootState = getState() as RootState;

    const { items } = rootState.cart;
    const { isAuth } = rootState.user;

    const { productId, quantity } = payload;
    try {
      if (isAuth) {
        await patchData(
          'shop_cart',
          { quantity },
          {
            product: `eq.${productId}`,
          },
        );
      } else {
        const updatedItems = payload.prevItems?.map((cartItem) => {
          if (cartItem.product.id === productId) {
            return { ...cartItem, quantity };
          } else {
            return cartItem;
          }
        });

        await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error(
        `INVENTORY ERROR: AN ERROR OCCURED WHILE UPDATING QUANTITY ${isAuth ? 'USER' : 'LOCAL'} CART`,
        error,
      );
      return rejectWithValue(items);
    }
  },
);

export const deleteMultipleCartItems = createAsyncThunk(
  'inventory/deleteMultipleCartItems',
  async (
    payload: {
      productIds: string[];
      user_id: string;
      prevItems: CartItem[] | null;
    },
    thunk,
  ) => {
    const { getState, rejectWithValue } = thunk;
    const store = getState() as RootState;
    const { isAuth } = store.user;

    try {
      if (isAuth) {
        const deletePromises = payload.productIds.map((id) =>
          deleteData('shop_cart', {
            product: `eq.${id}`,
          }),
        );
        await Promise.all(deletePromises);
      } else {
        const { items } = store.cart;
        const filteredItems =
          items?.filter(
            (item) => !payload.productIds.includes(item.product.id),
          ) || [];
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(filteredItems));
      }
    } catch (error) {
      console.error(`INVENTORY ERROR: BULK DELETE FAILED`, error);
      return rejectWithValue(payload.prevItems);
    }
  },
);

export const clearInventoryItems = createAsyncThunk(
  'inventory/clearInventoryItems',
  async () => {
    try {
      await AsyncStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error(
        `INVENTORY ERROR: AN ERROR OCCURED WHILE CLEARING INVENTORY ITEMS`,
        error,
      );
    } finally {
      return null;
    }
  },
);
