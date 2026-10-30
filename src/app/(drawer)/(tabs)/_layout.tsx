import Header from '@/components/Header';
import { useAppSelector } from '@/store/hooks';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

const iconSize = 27;

const tabScreenOptions: BottomTabNavigationOptions = {
  header: () => <Header />,

  tabBarShowLabel: false,
  tabBarActiveTintColor: 'black',
  tabBarInactiveTintColor: 'gray',
  tabBarStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 0,
    borderTopWidth: 0,
    paddingHorizontal: '8%',
    height: 80,
    paddingTop: 15,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    backgroundColor: 'white',
  },
};

const TabLayout = () => {
  const { count } = useAppSelector((store) => store.cart);
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="home" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover/index"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="search" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart/index"
        options={{
          tabBarIcon: ({ color }) => (
            <View className="relative">
              {count > 0 && (
                <View className="absolute -top-2 -right-2 z-10 bg-charcoal size-5 rounded-full">
                  <Text className="text-white text-xs mx-auto my-auto">
                    {count}
                  </Text>
                </View>
              )}
              <Ionicons name="cart-outline" size={iconSize + 2} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-o" size={iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
