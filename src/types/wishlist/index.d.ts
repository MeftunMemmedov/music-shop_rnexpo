import { Product } from '../product';

export type WishlistItem = {
  id?: string;
  product: Product;
  user_id?: string;
};

export type WishlistMutationProps = {
  product: Product;
  user_id?: string;
  isAuth: boolean;
  exists: boolean;
};
