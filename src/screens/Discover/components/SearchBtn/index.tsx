import { Text } from '@/components/AppText';
import { colors, styles } from '@/constants/style';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

const SearchBtn = () => {
  return (
    <View className="flex-row justify-between mt-5 pb-2">
      <Link href="/search" asChild>
        <Pressable
          className="flex-row items-center gap-3 h-[59px] rounded-full bg-zinc-50 w-[78%] px-7"
          style={styles.shadow}
        >
          <Feather name="search" size={24} color={colors['slate-gray']} />
          <Text className="text-slate-gray font-medium">Search</Text>
        </Pressable>
      </Link>
      <Link href="/search" asChild>
        <Pressable
          className="aspect-[51/49] bg-zinc-50 rounded-3xl"
          style={styles.shadow}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={28}
            color={colors['slate-gray']}
            className="m-auto"
          />
        </Pressable>
      </Link>
    </View>
  );
};

export default SearchBtn;
