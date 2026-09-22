import { Text } from '@/components/AppText';
import Header from '@/components/Header';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import Foundation from '@expo/vector-icons/Foundation';
import { Href, Link } from 'expo-router';
import { Fragment, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

const Settings = () => {
  const iconSize = 24;

  const { i18n } = useTranslation();

  const settingsNavlist: { title: string; href: Href; icon: JSX.Element }[] = [
    {
      title: `Language / ${i18n.language.toUpperCase()}`,
      href: '/settings/language',
      icon: <Fontisto name="world-o" size={24} color="black" />,
    },
    {
      title: 'Notifications',
      href: '/settings/notifications',
      icon: <Fontisto name="bell" size={iconSize} color="black" />,
    },
    {
      title: 'Terms of use',
      href: '/settings/tou',
      icon: <Foundation name="clipboard-notes" size={iconSize} color="black" />,
    },
  ];

  return (
    <View>
      <Header />
      <VStack className="container mt-10">
        {settingsNavlist.map((nav) => (
          <Fragment key={`${nav.title}-${nav.href}`}>
            <Link href={nav.href} asChild>
              <Pressable className="flex-row items-center justify-between py-7">
                <View className="flex-row items-center gap-5">
                  <View className="size-8 flex-row items-center justify-center">
                    {nav.icon}
                  </View>
                  <Text className="text-xl">{nav.title}</Text>
                </View>
                <Entypo
                  name={'chevron-small-right'}
                  size={30}
                  color="black"
                  className="mr-4"
                />
              </Pressable>
            </Link>
            <Divider />
          </Fragment>
        ))}
      </VStack>
    </View>
  );
};

export default Settings;
