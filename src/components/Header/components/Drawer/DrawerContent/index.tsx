import AccountInfo from '@/components/AccountInfo';
import { Text } from '@/components/AppText';
import { VStack } from '@/components/ui/vstack';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Navlink from './components/Navlink';
import { mainDrawerNavLinks, otherDrawerLinks } from './navlinks';

const DrawerContent = () => {
  return (
    <DrawerContentScrollView className="flex-1 bg-black">
      {/* ACCOUNT INFO */}
      <AccountInfo settingsDisabled />
      {/* ACCOUNT INFO */}

      {/* NAV */}
      <VStack className="mt-[71px]">
        {mainDrawerNavLinks.map((nav) => {
          const { label, href, icon } = nav;
          return (
            <Navlink
              label={label}
              href={href}
              icon={icon}
              key={`drawer-item-${href}`}
            />
          );
        })}
      </VStack>

      <Text className="my-6 px-5 text-base text-gray-500 uppercase">Other</Text>

      <VStack>
        {otherDrawerLinks.map((nav) => {
          const { label, href, icon } = nav;
          return (
            <Navlink
              label={label}
              href={href}
              icon={icon}
              key={`drawer-item-${href}`}
            />
          );
        })}
      </VStack>
      {/* NAV */}
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
