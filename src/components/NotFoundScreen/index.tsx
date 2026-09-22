import { View } from 'react-native';
import { Text } from '../AppText';

const NotFoundScreen = ({ message }: { message: string }) => {
  return (
    <View className="h-[50%]">
      <Text className="text-center text-xl">{message}</Text>
    </View>
  );
};

export default NotFoundScreen;
