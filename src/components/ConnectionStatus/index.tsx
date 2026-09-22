import Feather from '@expo/vector-icons/Feather';
import { useNetInfo } from '@react-native-community/netinfo';
import { View } from 'moti';
import { Text } from '../AppText';

const ConnectionStatus = () => {
  const { isConnected } = useNetInfo();

  return (
    <View
      from={isConnected ? { translateY: 0 } : { translateY: 50 }}
      animate={isConnected ? { translateY: 50 } : { translateY: 0 }}
      transition={{ duration: 500, delay: isConnected ? 1000 : undefined }}
      className={`absolute bottom-0 left-0 right-0 w-full z-30 flex-row justify-center items-center py-1 gap-1 transition-colors ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <Feather
        name={isConnected ? 'wifi' : 'wifi-off'}
        size={10}
        color="white"
      />
      <Text className="text-white text-sm">
        {isConnected ? "You're Online now" : "You're offline"}
      </Text>
    </View>
  );
};

export default ConnectionStatus;
