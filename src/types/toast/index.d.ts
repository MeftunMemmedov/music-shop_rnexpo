import { Href } from 'expo-router';

export type ToastContent = {
  title?: string;
  description: string;
  href?: Href;
};
