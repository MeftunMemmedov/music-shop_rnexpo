import { Product } from '../product';
import { User } from '../user';

export type Comment = {
  id: string;
  product: Product;
  comment: string;
  user: User;
  created_at: Date;
};

export type CommentForm = {
  user_id: string;
  product: string;
  comment: string;
};
