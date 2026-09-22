import { ShipMethod } from '@/types';

export const shippingMethods: {
  value: ShipMethod;
  price: string;
  title: string;
  subtitle: string;
}[] = [
  {
    value: 'free',
    price: 'Free',
    title: 'Delivery to home',
    subtitle: 'Delivery from 3 to 7 business days',
  },
  {
    value: 'normal',
    price: '5.90',
    title: 'Delivery to home',
    subtitle: 'Delivery from 4 to 6 business days',
  },
  {
    value: 'fast',
    price: '10.90',
    title: 'Fast delivery',
    subtitle: 'Delivery from 2 to 3 business days',
  },
];
