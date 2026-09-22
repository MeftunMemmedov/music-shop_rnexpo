import { Product } from '../product';

export type Order = {
  id: number;
  items: { product: Product; quantity: number }[];
  status: string;
  address: string;
  created_at: Date;
};

export type OrderItem = {
  id: string;
  phone: string;
  address: string;
  user_name: string;
  email: string;
  note: string;
  status: string;
  items: { product: Product; quantity: number }[];
  created_at: Date;
  ship_method: ShipMethod;
  pay_method: PayMethod;
};

export type ShipMethod = 'free' | 'normal' | 'fast';
export type PayMethod = 'Cash' | 'Credit Card';
// export type OrderItem = {
//   id: string;
//   phone: string;
//   address: string;
//   user_name: string;
//   email: string;
//   note: string;
//   status: string;
//   items: { product: Product; quantity: number }[];
//   created_at: Date;
// };
