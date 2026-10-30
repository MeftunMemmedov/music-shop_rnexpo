import Feather from '@expo/vector-icons/Feather';
import { FlatList, Text, View } from 'react-native';

const OrderTracking = () => {
  const trackingData = [
    {
      id: '1',
      title: 'Parcel is successfully delivered',
      date: '15 May 10:00',
      isCompleted: true,
      isLatest: true,
    },
    {
      id: '2',
      title: 'Parcel is out for delivery',
      date: '14 May 08:30',
      isCompleted: true,
      isLatest: false,
    },
    {
      id: '3',
      title: 'Parcel is received at delivery Branch',
      date: '13 May 17:45',
      isCompleted: true,
      isLatest: false,
    },
    {
      id: '4',
      title: 'Parcel is in transit',
      date: '13 May 07:20',
      isCompleted: true,
      isLatest: false,
    },
    {
      id: '5',
      title: 'Sender has shipped your parcel',
      date: '12 May 14:10',
      isCompleted: true,
      isLatest: false,
    },
    {
      id: '6',
      title: 'Sender is preparing to ship your order',
      date: '12 May 11:00',
      isCompleted: true,
      isLatest: false,
    },
  ];
  return (
    <View className="container flex-col gap-4 pt-28">
      <View className="flex-row items-center gap-1">
        <Text className="text-gray-500">Delivered on</Text>
        <Text>15.05.21</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Text className="text-gray-500">Tracking Number:</Text>
        <Text>IK2873688389</Text>
      </View>
      <FlatList
        className="mt-8"
        data={trackingData}
        renderItem={({ item, index }) => (
          <View className="flex-row">
            <View className="items-center w-8 mr-3">
              <View className="size-6 rounded-full border-2 border-gray-700 items-center justify-center bg-white z-10">
                <View className="size-4 flex-row items-center justify-center rounded-full bg-gray-700">
                  {!item.isLatest && (
                    <Feather name="check" size={12} color="white" />
                  )}
                </View>
              </View>
              {index !== trackingData.length - 1 && (
                <View className="flex-col items-center gap-2 py-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <View
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-600"
                    ></View>
                  ))}
                </View>
              )}
            </View>
            <View className="flex-1 flex-row justify-between pb-6">
              <Text className="text-gray-600 flex-1 pr-2">{item.title}</Text>
              <Text className="text-gray-500 text-xs mt-1">{item.date}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default OrderTracking;
