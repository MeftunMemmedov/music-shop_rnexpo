import { MetaImage } from '@/assets/images';
import { Image, View } from 'react-native';

const Campaign = () => {
  return (
    <View className="aspect-video">
      <Image source={MetaImage} className="size-full" />
    </View>
  );
};

export default Campaign;
