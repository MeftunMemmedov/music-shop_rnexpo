import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';

const iconSize = 20;

export const mainDrawerNavLinks: DrawerNavLinks[] = [
  {
    label: 'Homepage',
    href: '/',
    icon: ({ color }) => <Octicons name="home" size={iconSize} color={color} />,
  },
  {
    label: 'Discover',
    href: '/(drawer)/(tabs)/discover',
    icon: ({ color }) => (
      <Octicons name="search" size={iconSize} color={color} />
    ),
  },
  {
    label: 'Cart',
    href: '/(drawer)/(tabs)/cart',
    icon: ({ color }) => (
      <Ionicons name="cart-outline" size={iconSize + 2} color={color} />
    ),
  },
  {
    label: 'My profile',
    href: '/(drawer)/(tabs)/account',
    icon: ({ color }) => (
      <FontAwesome6 name="user" size={iconSize} color={color} />
    ),
  },
];

export const otherDrawerLinks: DrawerNavLinks[] = [
  {
    label: 'Settings',
    href: '/settings',
    icon: ({ color }) => (
      <Ionicons name="settings-outline" size={iconSize} color={color} />
    ),
  },
  {
    label: 'About us',
    href: '/about',
    icon: ({ color }) => (
      <AntDesign name="info-circle" size={iconSize} color={color} />
    ),
  },
  // {
  //   label: 'Auth',
  //   href: '/auth/signin',
  //   icon: ({ color }) => (
  //     <AntDesign name="info-circle" size={iconSize} color={color} />
  //   ),
  // },
];
