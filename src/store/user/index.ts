import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  deleteUserComment,
  editUserComment,
  editUserInfo,
  getUser,
  getUserComments,
  logUserOut,
  signUserIn,
} from './asyncThunks';
import {
  deleteUserCommentActions,
  editUserCommentActions,
  editUserInfoActions,
  getUserActions,
  getUserCommentsActions,
  logUserOutActions,
  signUserInActions,
} from './asyncThunks/actions';
import { initialUserState } from './initialState';

const slice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    logOut: (state) => {
      state.info = null;
      state.isAuth = false;
    },
    clearUserComments: (state) => {
      state.userComments = null;
    },
    setFirstLaunch: (state, { payload }) => {
      state.isFirstLaunch = payload;
    },
    setOrderInfo: (state, { payload }) => {
      state.orderInfo = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, getUserActions.pending)
      .addCase(getUser.fulfilled, getUserActions.fulfilled)
      .addCase(getUser.rejected, getUserActions.rejected);
    builder
      .addCase(editUserInfo.pending, editUserInfoActions.pending)
      .addCase(editUserInfo.fulfilled, editUserInfoActions.fulfilled)
      .addCase(editUserInfo.rejected, editUserInfoActions.rejected);
    builder
      .addCase(getUserComments.pending, getUserCommentsActions.pending)
      .addCase(getUserComments.fulfilled, getUserCommentsActions.fulfilled)
      .addCase(getUserComments.rejected, getUserCommentsActions.rejected);

    builder
      .addCase(signUserIn.pending, signUserInActions.pending)
      .addCase(signUserIn.fulfilled, signUserInActions.fulfilled)
      .addCase(signUserIn.rejected, signUserInActions.rejected);
    builder
      .addCase(logUserOut.pending, logUserOutActions.pending)
      .addCase(logUserOut.fulfilled, logUserOutActions.fulfilled)
      .addCase(logUserOut.rejected, logUserOutActions.rejected);
    builder.addCase(editUserComment.pending, editUserCommentActions.pending);
    builder.addCase(
      deleteUserComment.pending,
      deleteUserCommentActions.pending,
    );
    builder.addMatcher(
      isAnyOf(
        editUserComment.fulfilled,
        editUserComment.rejected,
        deleteUserComment.fulfilled,
        deleteUserComment.rejected,
      ),
      (state, { meta }) => {
        delete state.status.comments.updating![meta.arg.commentId];
        if (Object.keys(state.status.comments.updating!).length === 0) {
          state.status.comments.updating = null;
        }
      },
    );
  },
});

export const { logOut, clearUserComments, setFirstLaunch, setOrderInfo } =
  slice.actions;
export default slice.reducer;
