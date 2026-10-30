import { View } from 'react-native';
import { Text } from '../AppText';

const EmptyScreen = ({ message }: { message: string }) => {
  return (
    <View className="h-1/2">
      <View className="my-auto">
        <Text className="text-center text-xl font-semibold">{message}</Text>
      </View>
    </View>
  );
};

export default EmptyScreen;
