import { FAILURE, LOADING, SUCCESS } from '@/constants/status';
import type {
  clearInventoryItems,
  deleteMultipleCartItems,
  getCart,
  toggleCart,
  updateQuantity,
} from '.';

import {
  toggleCartHelper,
  updateCartitemQuantityHelper,
  updateCartNumbers,
} from '@/helpers/cart';
import { CartItem, CartState, ExtraReducerActions } from '@/types';

export const getCartActions: ExtraReducerActions<CartState, typeof getCart> = {
  pending: (state) => {
    state.status.init = { ...LOADING };
  },
  fulfilled: (state, { payload }) => {
    state.status.init = { ...SUCCESS };
    state.items = payload;
    updateCartNumbers(state, state.items);
  },
  rejected: (state, { payload }) => {
    state.status.init = { ...FAILURE };
    state.items = payload as CartItem[] | null;
    updateCartNumbers(state, state.items);
  },
};

export const toggleCartActions: ExtraReducerActions<
  CartState,
  typeof toggleCart
> = {
  pending: (state, { meta }) => {
    if (state.status.updating === null) {
      state.status.updating = {};
    }
    state.status.updating[meta.arg.item.product.id] = true;

    state.items = toggleCartHelper(state.items, meta.arg.item);
    updateCartNumbers(state, state.items);
  },
  fulfilled: (state, { meta }) => {
    delete state.status.updating![meta.arg.item.product.id];

    if (Object.keys(state.status.updating!).length === 0)
      state.status.updating = null;
  },
  rejected: (state, { payload, meta }) => {
    delete state.status.updating![meta.arg.item.product.id];

    if (Object.keys(state.status.updating!).length === 0)
      state.status.updating = null;

    state.items = payload as CartItem[] | null;
    updateCartNumbers(state, state.items);
  },
};

export const updateQuantityActions: ExtraReducerActions<
  CartState,
  typeof updateQuantity
> = {
  pending: (state, { meta }) => {
    if (state.status.updating === null) {
      state.status.updating = {};
    }
    state.status.updating[meta.arg.productId] = true;

    state.items = updateCartitemQuantityHelper(
      state.items,
      meta.arg.productId,
      meta.arg.quantity,
    );
    updateCartNumbers(state, state.items);
  },
  fulfilled: (state, { meta }) => {
    delete state.status.updating![meta.arg.productId];

    if (Object.keys(state.status.updating!).length === 0)
      state.status.updating = null;
  },
  rejected: (state, { payload, meta }) => {
    delete state.status.updating![meta.arg.productId];

    if (Object.keys(state.status.updating!).length === 0)
      state.status.updating = null;

    state.items = payload as CartItem[] | null;
    updateCartNumbers(state, state.items);
  },
};

export const deleteMultipleCartItemsActions: ExtraReducerActions<
  CartState,
  typeof deleteMultipleCartItems
> = {
  pending: (state, { meta }) => {
    for (const productId of meta.arg.productIds) {
      if (state.status.updating === null) {
        state.status.updating = {};
      }
      state.status.updating[productId] = true;
    }

    state.items =
      state.items?.filter(
        (item) => !meta.arg.productIds.includes(item.product.id),
      ) || null;
    updateCartNumbers(state, state.items);
  },
  fulfilled: (state, { meta }) => {
    for (const productId of meta.arg.productIds) {
      delete state.status.updating![productId];
    }
    if (Object.keys(state.status.updating!).length === 0)
      state.status.updating = null;
  },
  rejected: (state, { meta, payload }) => {
    for (const productId of meta.arg.productIds) {
      delete state.status.updating![productId];
    }
    if (Object.keys(state.status.updating!).length === 0)
      state.status.updating = null;

    state.items = payload as CartItem[] | null;
    updateCartNumbers(state, state.items);
  },
};

export const clearInventoryItemsActions: ExtraReducerActions<
  CartState,
  typeof clearInventoryItems
> = {
  pending: (state) => {
    state.status.init = { ...LOADING };
  },
  fulfilled: (state, { payload }) => {
    state.status.init = { ...SUCCESS };
    state.items = payload;
    updateCartNumbers(state, state.items);
  },
  rejected: (state, { payload }) => {
    state.status.init = { ...FAILURE };
    state.items = payload as null;
  },
};
