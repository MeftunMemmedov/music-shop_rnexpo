import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Text } from '../AppText';

interface Props {
  className?: string;
  refresh?: () => void;
}

const NoConnectionScreen = ({ className, refresh }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    if (!refresh) return;
    try {
      setIsRefreshing(true);
      refresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  return (
    <ScrollView
      contentContainerClassName={`h-[80%] container ${className}`}
      {...(refresh && {
        refreshControl: (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ),
      })}
    >
      <View className="my-auto">
        <MaterialIcons
          name="signal-wifi-connected-no-internet-4"
          size={100}
          color="black"
          className="mx-auto mb-10"
        />
        <Text className="text-xl font-semibold text-center mb-2">
          No Internet Connection
        </Text>
        <Text className="text-lg text-center">
          {
            "We couldn't establish a connection to the network. Please check your router or cellular settings and try again."
          }
        </Text>
      </View>
    </ScrollView>
  );
};

export default NoConnectionScreen;
