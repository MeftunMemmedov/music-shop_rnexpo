import useNotifications from '@/hooks/query/useNotifications';
import { useAppSelector } from '@/store/hooks';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

const NotificationLink = () => {
  const { isAuth } = useAppSelector((store) => store.user);

  const { data: notifications } = useNotifications(isAuth);

  return (
    <Link href="/notifications" asChild>
      <Pressable className="relative">
        {notifications &&
          notifications.length > 0 &&
          notifications.some((notif) => notif.is_read) && (
            <View className="size-2 bg-red-500 absolute -top-0.5 -right-0.5 rounded-full z-10" />
          )}
        <Fontisto name="bell" size={24} color="black" />
      </Pressable>
    </Link>
  );
};

export default NotificationLink;
