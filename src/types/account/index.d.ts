import { Href } from 'expo-router';

export type Account = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type ChangePassword = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export type AccountNav = {
  label: string;
  icon: JSX.Element;
  href?: Href;
  onPress?: () => void;
};
