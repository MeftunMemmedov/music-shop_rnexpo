import { CART_KEY } from '@/constants/storagekeys';
import { CartItem, CartState } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductPrice } from './product';

export const updateCartStorage = async (payload: CartItem[] | null) => {
  try {
    if (payload === null) {
      await AsyncStorage.removeItem(CART_KEY);
    } else {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(payload));
    }
  } catch (error) {
    console.error('AN ERROR OCCURED WHILE ASYNCSTORAGE MUTATION', error);
  }
};

export const toggleCartHelper = (
  cartItems: CartItem[] | null,
  payload: CartItem,
) => {
  const existing = cartItems?.some(
    (cartItem) => cartItem.product.id === payload.product.id,
  );

  if (cartItems === null) {
    const newCart: CartItem[] = [];
    newCart.push(payload);
    return newCart;
  } else if (existing) {
    cartItems = cartItems.filter(
      (cartItem) => cartItem.product.id !== payload.product.id,
    );
    return cartItems;
  } else {
    cartItems.push(payload);
    return cartItems;
  }
};

export const updateCartitemQuantityHelper = (
  cartItems: CartItem[] | null,
  productId: string,
  quantity: number,
) => {
  cartItems = cartItems!.map((cartItem) => {
    if (cartItem.product.id === productId) {
      return { ...cartItem, quantity };
    } else {
      return cartItem;
    }
  });

  return cartItems;
};

export const updateCartNumbers = (
  state: CartState,
  updatedCart: CartItem[] | null,
) => {
  if (updatedCart == null) {
    state.count = 0;
    state.total = 0;
    return;
  }

  state.count = updatedCart.length;
  state.total = updatedCart.reduce((acc, item) => {
    return acc + getProductPrice(item.product) * item.quantity;
  }, 0);
};
