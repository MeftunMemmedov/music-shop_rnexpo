import { ProfilePic } from '@/assets/images';
import { useAppSelector } from '@/store/hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Image, View } from 'react-native';
import { Text } from '../AppText';

const AccountInfo = ({
  settingsDisabled = false,
}: {
  settingsDisabled?: boolean;
}) => {
  const { isAuth, info } = useAppSelector((store) => store.user);

  if (!isAuth) return null;
  return (
    <View className="flex-row items-center justify-between mt-16 px-10">
      <View className="flex-row items-center gap-4">
        <Image
          source={ProfilePic}
          width={63}
          height={63}
          className="rounded-full size-16 aspect-square"
        />
        <View>
          <Text
            className="font-bold text-base mb-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {info?.user_name}
          </Text>
          <Text
            className="font-bold text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {info?.email}
          </Text>
        </View>
      </View>
      {!settingsDisabled && (
        <Link href="/account/settings">
          <Ionicons name="settings-sharp" size={24} color="black" />
        </Link>
      )}
    </View>
  );
};

export default AccountInfo;
