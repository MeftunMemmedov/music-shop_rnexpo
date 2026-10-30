import { View } from 'react-native';
import { MovingDotLoader } from '../MovingDotLoader';

const LoadingScreen = () => {
  return (
    <View className="h-1/2">
      <View className="my-auto">
        <MovingDotLoader dotClassName="bg-charcoal" />
      </View>
    </View>
  );
};

export default LoadingScreen;
