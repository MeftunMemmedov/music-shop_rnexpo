import { initialStatus } from '@/constants/status';
import { UserState } from '@/types';

export const initialUserState: UserState = {
  isAuth: false,
  info: null,
  userComments: null,
  isRequestFinished: false,
  isFirstLaunch: false,
  orderInfo: null,
  status: {
    user: { ...initialStatus },
    comments: {
      init: { ...initialStatus },
      updating: null,
    },
  },
};
