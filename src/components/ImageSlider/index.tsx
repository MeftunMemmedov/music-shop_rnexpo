import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Carousel, { CarouselRenderItem } from 'react-native-reanimated-carousel';

interface Props<T> {
  className: string;
  bulletContainerClassName: string;
  activeBulletClassName: string;
  inActiveBulletClassName: string;
  data: T[];
  renderItem: CarouselRenderItem<T>;
  isPaused?: boolean;
  onSlideChange?: (index: number) => void;
}

const ImageSlider = <T,>({
  className,
  bulletContainerClassName,
  activeBulletClassName,
  inActiveBulletClassName,
  data,
  renderItem,
  isPaused = false,
  onSlideChange,
}: Props<T>) => {
  const [width, setWidth] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const isDataMoreThanOne = data.length > 1 && !isPaused;

  return (
    <View
      onLayout={handleLayout}
      className={`overflow-hidden flex-row justify-center relative ${className}`}
    >
      <View
        className={`flex-row justify-center items-center gap-2 absolute z-20 ${bulletContainerClassName}`}
      >
        {isDataMoreThanOne &&
          data.map((_, index) => (
            <View
              key={index}
              className={`aspect-square  mr-2 ${activeIndex === index ? 'border border-white rounded-full w-4' : 'w-3'}`}
            >
              <View
                className={`w-3/5 aspect-square rounded-full m-auto ${activeIndex === index ? activeBulletClassName : inActiveBulletClassName}`}
              ></View>
            </View>
          ))}
      </View>
      {width > 0 && (
        <Carousel
          loop={isDataMoreThanOne}
          pagingEnabled={isDataMoreThanOne}
          snapEnabled={isDataMoreThanOne}
          autoPlay={isDataMoreThanOne}
          autoPlayInterval={isDataMoreThanOne ? 2000 : undefined}
          onSnapToItem={(index) => {
            setActiveIndex(index);

            if (onSlideChange) {
              onSlideChange(index);
            }
          }}
          width={width}
          data={data}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ImageSlider;

// import { LayoutChangeEvent, View } from 'react-native';
// import Carousel, {
//   CarouselRenderItem,
//   ICarouselInstance,
// } from 'react-native-reanimated-carousel';

// interface Props<T> {
//   data: T[];
//   className: string;
//   bulletContainerClassName: string;
//   activeBulletClassName: string;
//   inActiveBulletClassName: string;
//   autoPlay?: boolean;
//   renderItem: CarouselRenderItem<T>;
//   ref: RefObject<ICarouselInstance | null>;
// }

// const ImageSlider = <T,>({
//   ref,
//   data,
//   autoPlay = true,
//   renderItem,
//   className,
//   bulletContainerClassName,
//   activeBulletClassName,
//   inActiveBulletClassName,
// }: Props<T>) => {
//   const [width, setWidth] = useState(0);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const handleLayout = (e: LayoutChangeEvent) => {
//     setWidth(e.nativeEvent.layout.width);
//   };

//   return (
//     <View
//       onLayout={handleLayout}
//       className={`overflow-hidden flex-row justify-center relative ${className}`}
//     >
//       <View
//         className={`flex-row justify-center items-center gap-2 absolute z-20 ${bulletContainerClassName}`}
//       >
//         {data.map((_, index) => (
//           <View
//             key={index}
//             className={`aspect-square  mr-2 ${activeIndex === index ? 'border border-white rounded-full w-4' : 'w-3'} flex-row justify-center items-center`}
//           >
//             <View
//               className={`w-3/5 aspect-square rounded-full ${activeIndex === index ? activeBulletClassName : inActiveBulletClassName}`}
//             ></View>
//           </View>
//         ))}
//       </View>
//       {width > 0 && (
//         <Carousel
//           ref={ref}
//           loop
//           pagingEnabled
//           snapEnabled
//           autoPlay={autoPlay}
//           autoPlayInterval={autoPlay ? 5000 : undefined}
//           onSnapToItem={(index) => setActiveIndex(index)}
//           width={width}
//           data={data}
//           renderItem={renderItem}
//         />
//       )}
//     </View>
//   );
// };

// export default ImageSlider;
