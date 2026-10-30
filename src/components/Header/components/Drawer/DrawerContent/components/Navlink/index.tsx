import { Text } from '@/components/AppText';
import { Link, usePathname } from 'expo-router';
import { Pressable, View } from 'react-native';

const Navlink = ({ label, href, icon }: DrawerNavLinks) => {
  const pathname = usePathname();

  const isActive = String(href).endsWith(pathname);

  return (
    <Link href={href} asChild>
      <Pressable
        aria-selected={isActive}
        disabled={isActive}
        className="aria-selected:bg-gray-100 aria-selected:border rounded-xl"
      >
        <View className="flex-row items-center gap-3 p-5">
          <View className="w-8 h-8 flex-row items-center justify-center text-red">
            {icon({ color: isActive ? 'black' : 'gray' })}
          </View>
          <Text
            className={`font-semibold text-lg ${isActive ? 'text-black' : 'text-gray-500'}`}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default Navlink;
