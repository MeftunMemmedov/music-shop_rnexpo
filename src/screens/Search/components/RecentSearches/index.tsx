import { Text } from '@/components/AppText';
import { RECENT_SEARCHES_KEY } from '@/constants/storagekeys';
import { colors } from '@/constants/style';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch, SetStateAction } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

interface Props {
  recentSearches: string[];
  setRecentSearches: Dispatch<SetStateAction<string[]>>;
  setSearchInput: Dispatch<SetStateAction<string>>;
  disabled: boolean;
}

const RecentSearches = ({
  recentSearches,
  setRecentSearches,
  setSearchInput,
  disabled,
}: Props) => {
  if (recentSearches.length === 0) return null;

  const clearAllRecentSearches = async () => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([]));
      setRecentSearches([]);
    } catch (error) {
      console.error(
        'AN ERROR OCCURED WHILE CLEARING ALL RECENT SEARCHES',
        error,
      );
    }
  };

  const clearRecentSearchKey = (key: string) => {
    const filtered = recentSearches.filter((searchKey) => searchKey !== key);
    setRecentSearches(filtered);
    AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
  };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-muted text-lg my-4">
          Recent searches
        </Text>
        <Pressable className="p-3" onPress={clearAllRecentSearches}>
          <Feather name="trash-2" size={20} color={colors.muted} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-5"
      >
        {recentSearches.map((recentSearchKey, index) => (
          <View
            className="flex-row items-center gap-4 mr-3 bg-zinc-50 rounded-xl"
            key={`recent-search-${index}`}
          >
            <Pressable
              onPress={() => setSearchInput(recentSearchKey)}
              disabled={disabled}
              className="py-1 pl-5 pr-2"
            >
              <Text className="text-stone-gray font-normal">
                {recentSearchKey}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => clearRecentSearchKey(recentSearchKey)}
              className=" size-6"
            >
              <AntDesign
                name="close"
                size={14}
                color={colors['soft-blue']}
                className="my-auto"
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentSearches;
