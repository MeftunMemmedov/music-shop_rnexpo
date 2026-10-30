import { Status } from '@/constants/status';
import { CheckoutInput } from '@/schemas/checkout.schema';
import { WritableDraft } from '@reduxjs/toolkit';
import { Brand } from '../brand';
import { CartItem } from '../cart';
import { Category } from '../category';
import { Comment } from '../comment';
import { PayMethod } from '../order';
import { Slide } from '../slide';
import { User } from '../user';

export type ExtraReducerActions<
  StateType,
  ThunkType extends AsyncThunk<any, any, any>,
> = {
  pending: (state: StateType, action: ReturnType<ThunkType['pending']>) => void;
  fulfilled: (
    state: StateType,
    action: ReturnType<ThunkType['fulfilled']>,
  ) => void;
  rejected: (
    state: StateType,
    action: ReturnType<ThunkType['rejected']>,
  ) => void;
};

export type CartStateProps = {
  items: CartItem[] | null;
  count: number;
  total: number;
  status: {
    init: Status;
    updating: Record<string, boolean> | null;
  };
};

export type UserStateProps = {
  isAuth: boolean;
  info: User | null;
  isRequestFinished: boolean;
  userComments: Comment[] | null;
  isFirstLaunch: boolean;
  orderInfo: (CheckoutInput & { pay_method: PayMethod }) | null;
  status: {
    user: Status;
    comments: {
      init: Status;
      updating: Record<string, boolean> | null;
    };
  };
};

export type DataStateProps = {
  categories: Category[] | null;
  brands: Brand[] | null;
  slides: Slide[] | null;
  status: {
    category: Status;
    brand: Status;
    slide: Status;
  };
};

export type UserState = WritableDraft<UserStateProps>;
export type CartState = WritableDraft<CartStateProps>;
export type DataState = WritableDraft<DataStateProps>;
