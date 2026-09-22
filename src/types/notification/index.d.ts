import { RelativePathString } from 'expo-router';

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  route: RelativePathString;
};
