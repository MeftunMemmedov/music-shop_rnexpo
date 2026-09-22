import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Text } from '../AppText';

const ErrorScreen = ({ refresh }: { refresh?: () => void }) => {
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
      contentContainerClassName="h-1/2"
      {...(refresh && {
        refreshControl: (
          <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
        ),
      })}
    >
      <View className="my-auto">
        <Text className="text-center text-xl font-semibold">
          An error occured! Please refresh the page
        </Text>
      </View>
    </ScrollView>
  );
};

export default ErrorScreen;
