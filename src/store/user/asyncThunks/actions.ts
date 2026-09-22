import { FAILURE, LOADING, SUCCESS } from '@/constants/status';
import { Comment, ExtraReducerActions, User, UserState } from '@/types';
import type {
  deleteUserComment,
  editUserComment,
  editUserInfo,
  getUser,
  getUserComments,
  logUserOut,
  signUserIn,
} from '.';

export const getUserActions: ExtraReducerActions<UserState, typeof getUser> = {
  pending: (state) => {
    state.status.user = { ...LOADING };
    state.isRequestFinished = false;
  },
  fulfilled: (state, { payload }) => {
    state.status.user = { ...SUCCESS };
    state.isRequestFinished = true;
    if (!payload) return;
    state.isAuth = payload.isAuth;
    state.info = payload.user;
  },
  rejected: (state) => {
    state.status.user = { ...FAILURE };
    state.isRequestFinished = true;
  },
};

export const editUserInfoActions: ExtraReducerActions<
  UserState,
  typeof editUserInfo
> = {
  pending: (state, { meta }) => {
    state.status.user = { ...LOADING };
    const { input } = meta.arg;
    if (!state.info) return;
    state.info.email = input.email;
    state.info.user_name = input.data.user_name;
  },
  fulfilled: (state) => {
    state.status.user = { ...SUCCESS };
  },
  rejected: (state, { payload }) => {
    state.status.user = { ...FAILURE };
    const { user_name, email } = payload as User;
    if (!state.info) return;

    state.info.email = email;
    state.info.user_name = user_name;
  },
};

export const getUserCommentsActions: ExtraReducerActions<
  UserState,
  typeof getUserComments
> = {
  pending: (state) => {
    state.status.comments.init = { ...LOADING };
    state.userComments = null;
  },
  fulfilled: (state, { payload }) => {
    state.status.comments.init = { ...SUCCESS };
    state.userComments = payload as Comment[] | null;
  },
  rejected: (state, { payload }) => {
    state.status.comments.init = { ...FAILURE };
    state.userComments = payload as Comment[] | null;
  },
};

export const editUserCommentActions: ExtraReducerActions<
  UserState,
  typeof editUserComment
> = {
  pending: (state, { meta }) => {
    const { comment: newComment, commentId } = meta.arg;

    if (state.status.comments.updating === null) {
      state.status.comments.updating = {};
    }
    state.status.comments.updating[commentId] = true;

    state.userComments = state.userComments!.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, comment: newComment };
      } else {
        return comment;
      }
    });
  },
  fulfilled: () => {},
  rejected: (state, { payload }) => {
    state.userComments = payload as Comment[] | null;
  },
};

export const deleteUserCommentActions: ExtraReducerActions<
  UserState,
  typeof deleteUserComment
> = {
  pending: (state, { meta }) => {
    if (state.status.comments.updating === null) {
      state.status.comments.updating = {};
    }

    const { commentId, prevComments } = meta.arg;

    state.status.comments.updating[commentId] = true;

    state.userComments = prevComments!.filter(
      (comment) => comment.id !== commentId,
    );
  },
  fulfilled: () => {},
  rejected: (state, { payload }) => {
    state.userComments = payload as Comment[] | null;
  },
};

export const signUserInActions: ExtraReducerActions<
  UserState,
  typeof signUserIn
> = {
  pending: (state) => {
    state.status.user = { ...LOADING };
  },
  fulfilled: (state) => {
    state.status.user = { ...SUCCESS };
  },
  rejected: (state) => {
    state.status.user = { ...FAILURE };
  },
};

export const logUserOutActions: ExtraReducerActions<
  UserState,
  typeof logUserOut
> = {
  pending: (state) => {
    state.status.user = { ...LOADING };
  },
  fulfilled: (state) => {
    state.status.user = { ...SUCCESS };
    state.isAuth = false;
    state.info = null;
    state.userComments = null;
  },
  rejected: (state) => {
    state.status.user = { ...FAILURE };
  },
};
