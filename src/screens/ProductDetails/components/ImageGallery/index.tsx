import ImageSlider from '@/components/ImageSlider';
import {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
  ImageViewerTrigger,
} from '@/components/ui/image-viewer';
import { View } from 'moti';
import { useState } from 'react';
import { Image } from 'react-native';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
interface Props {
  scroll_Y_value: number;
  images: { url: string; alt: string }[];
}

const ImageGallery = ({ scroll_Y_value, images }: Props) => {
  const [activeImageSlideIndex, setActiveImageSlideIndex] = useState<number>(0);
  const [isImageSliderPaused, setIsImageSliderPaused] =
    useState<boolean>(false);

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scroll_Y_value,
          [0, 300],
          [0, 120],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));
  return (
    <View style={parallaxStyle}>
      <ImageViewer
        onOpenChange={setIsImageSliderPaused}
        images={images}
        initialIndex={activeImageSlideIndex}
      >
        <ImageViewerTrigger>
          <ImageSlider
            isPaused={isImageSliderPaused}
            data={images}
            className="max-md:aspect-square max-md:h-auto md:h-[400px]"
            bulletContainerClassName="bottom-14"
            activeBulletClassName="bg-black"
            inActiveBulletClassName="bg-black/50"
            onSlideChange={setActiveImageSlideIndex}
            renderItem={({ item: image }) => (
              <View className="flex-1 w-full">
                <Image
                  source={{ uri: image.url }}
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
              </View>
            )}
          />
        </ImageViewerTrigger>
        <ImageViewerContent>
          <ImageViewerCloseButton />
          <ImageViewerNavigation />
          <ImageViewerCounter />
        </ImageViewerContent>
      </ImageViewer>
    </View>
  );
};

export default ImageGallery;
