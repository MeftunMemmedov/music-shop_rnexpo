import ImageSlider from '@/components/ImageSlider';
import { useSlides } from '@/hooks/query';
import { Image, View } from 'react-native';

const MainSlider = () => {
  const { data: slides, error } = useSlides();

  if (!slides || slides.length === 0 || error) return null;
  return (
    <ImageSlider
      data={slides}
      className="aspect-video rounded-xl"
      activeBulletClassName="bg-white"
      inActiveBulletClassName="bg-white/50"
      bulletContainerClassName="bottom-3"
      renderItem={({ item: slide }) => (
        <View className="flex-1 w-full">
          <Image source={{ uri: slide.image }} className="w-full h-full" />
        </View>
      )}
    />
  );
};

export default MainSlider;
