import { LOGO } from '@/assets/images';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Text } from '../AppText';
import ScaleView from '../ScaleView';
import DrawerButton from './components/Drawer/DrawerButton';
import NotificationLink from './components/NotificationLink';

interface Props {
  type?: 'back' | 'drawer' | 'productdetails';
  title?: string;
  // productId?: string;
  isProductInWishlist?: boolean;
  handleToggleWishlistItem?: () => void;
}

const Header = ({
  type = 'drawer',
  title,
  // productId,
  isProductInWishlist,
  handleToggleWishlistItem,
}: Props) => {
  const router = useRouter();

  const [isBackPressed, setIsBackPressed] = useState<boolean>(false);
  const [isWishlistPressed, setIsWishlistPressed] = useState<boolean>(false);

  return (
    <View
      className={`flex-row h-28 pb-2 ${type === 'productdetails' ? 'absolute top-0 left-0 z-30' : ''}`}
    >
      <View className="flex-row justify-center items-end container">
        <View className="w-1/5 flex-row items-center gap-5">
          {type === 'drawer' ? (
            <DrawerButton />
          ) : (
            <Pressable
              onPressIn={() => setIsBackPressed(true)}
              onPressOut={() => setIsBackPressed(false)}
              onPress={() => router.back()}
            >
              <ScaleView
                pressedState={isBackPressed}
                className="bg-white size-12 aspect-square shadow-lg flex-row rounded-full justify-center items-center"
              >
                <Entypo name="chevron-small-left" size={24} color="black" />
              </ScaleView>
            </Pressable>
          )}
        </View>
        <View className="w-3/5 h-10">
          {title && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className={`text-center font-bold ${title.length > 20 ? 'text-base' : 'text-xl'} my-auto`}
            >
              {title}
            </Text>
          )}
          {type === 'drawer' && (
            <View>
              <Image source={LOGO} className="size-10 m-auto" />
            </View>
          )}
        </View>
        <View className="w-1/5 flex-row items-center justify-end">
          {type === 'drawer' && <NotificationLink />}
          {type === 'productdetails' && (
            <Pressable
              onPress={() => {
                if (handleToggleWishlistItem) {
                  handleToggleWishlistItem();
                }
              }}
              onPressIn={() => setIsWishlistPressed(true)}
              onPressOut={() => setIsWishlistPressed(false)}
            >
              <ScaleView
                pressedState={isWishlistPressed}
                className="bg-white size-12 aspect-square shadow-lg flex-row rounded-full justify-center items-center"
              >
                <MotiView
                  key={isProductInWishlist ? 'wishlist' : 'unwishlist'}
                  animate={{
                    scale: isWishlistPressed
                      ? isProductInWishlist
                        ? [1.5, 1]
                        : [0.7, 1]
                      : 1,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 12,
                    stiffness: 250,
                  }}
                >
                  {isProductInWishlist ? (
                    <Entypo name="heart" size={24} color="red" />
                  ) : (
                    <Entypo name="heart-outlined" size={24} color="black" />
                  )}
                </MotiView>
              </ScaleView>
            </Pressable>
          )}
        </View>
      </View>

      {/* {(type === 'back' || type === 'productdetails') && (
        <>
          <View className="w-1/3 flex-row items-center gap-5">
            <Text className="text-lg font-semibold">{title}</Text>
          </View>
          {type === 'productdetails' && (
            <View className="w-1/3 flex-row justify-end">
              <Pressable className="bg-white size-12 aspect-square shadow-xl flex-row rounded-full justify-center items-center">
                <Entypo name="heart" size={24} color="red" />
              </Pressable>
            </View>
          )}
        </>
      )} */}
    </View>
  );
};

export default Header;
