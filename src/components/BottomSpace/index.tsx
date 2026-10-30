import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

const BottomSpace = () => {
  const tabbarHeight = useBottomTabBarHeight();
  return <View style={{ height: tabbarHeight + 20 }} />;
};

export default BottomSpace;
