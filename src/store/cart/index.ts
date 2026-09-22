import { createSlice } from '@reduxjs/toolkit';
import {
  clearInventoryItems,
  deleteMultipleCartItems,
  getCart,
  toggleCart,
  updateQuantity,
} from './asyncThunks';
import {
  clearInventoryItemsActions,
  deleteMultipleCartItemsActions,
  getCartActions,
  toggleCartActions,
  updateQuantityActions,
} from './asyncThunks/actions';

import { initialCartState } from './initialState';

export const slice = createSlice({
  name: 'inventory',
  initialState: initialCartState,
  reducers: {},
  extraReducers: (builder) => {
    // CART
    builder
      .addCase(getCart.pending, getCartActions.pending)
      .addCase(getCart.fulfilled, getCartActions.fulfilled)
      .addCase(getCart.rejected, getCartActions.rejected);
    builder
      .addCase(toggleCart.pending, toggleCartActions.pending)
      .addCase(toggleCart.fulfilled, toggleCartActions.fulfilled)
      .addCase(toggleCart.rejected, toggleCartActions.rejected);
    builder
      .addCase(updateQuantity.pending, updateQuantityActions.pending)
      .addCase(updateQuantity.fulfilled, updateQuantityActions.fulfilled)
      .addCase(updateQuantity.rejected, updateQuantityActions.rejected);
    builder
      .addCase(
        deleteMultipleCartItems.pending,
        deleteMultipleCartItemsActions.pending,
      )
      .addCase(
        deleteMultipleCartItems.fulfilled,
        deleteMultipleCartItemsActions.fulfilled,
      )
      .addCase(
        deleteMultipleCartItems.rejected,
        deleteMultipleCartItemsActions.rejected,
      );
    builder
      .addCase(clearInventoryItems.pending, clearInventoryItemsActions.pending)
      .addCase(
        clearInventoryItems.fulfilled,
        clearInventoryItemsActions.fulfilled,
      )
      .addCase(
        clearInventoryItems.rejected,
        clearInventoryItemsActions.rejected,
      );
  },
});

export default slice.reducer;
