import { Brand } from '../brand';
import { Category } from '../category';

export type Product = {
  id: string;
  slug: string;
  title: string;
  images: string[];
  category: Category;
  is_featured: boolean;
  price: number;
  discount: number;
  description: string;
  brand: Brand;
  final_price: number;
};

export type ProductFilterParams = {
  slug: string | string[];
  categoryQuery: string;
  brandQuery: string;
  priceQuery_gte: string;
  priceQuery_lte: string;
  orderQuery: string;
};
