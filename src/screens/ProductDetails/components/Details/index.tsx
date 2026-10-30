import { Divider } from '@/components/ui/divider';

import { CategoryIcon } from '@/assets/images';
import { Text } from '@/components/AppText';
import { getPriceDisplay } from '@/helpers/product';
import { Comment, Product } from '@/types';
import { Dimensions, Image, View } from 'react-native';
import Accordions from './components/Accordions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  product: Product;
  comments: Comment[];
  isCommentsLooading: boolean;
}

const Details = ({ product, comments, isCommentsLooading }: Props) => {
  return (
    <>
      <View
        className="z-20 bg-white rounded-t-[20px] px-10 "
        style={{ minHeight: SCREEN_HEIGHT / 2, marginTop: -30, paddingTop: 50 }}
      >
        <View className="flex-row items-center gap-1.5 mb-3">
          <View className="flex-row items-center">
            <Image
              width={10}
              height={10}
              className="size-5 mr-2"
              style={{ objectFit: 'contain' }}
              source={
                product.category.image
                  ? { uri: product.category.image }
                  : CategoryIcon
              }
            />
            <Text>{product.category.title}</Text>
          </View>
          {product.brand && (
            <>
              <View className="w-[1px] h-3 bg-black" />
              <Text>{product.brand.title}</Text>
            </>
          )}
        </View>
        <View className="flex-row justify-between">
          <Text
            className={`${product.title.length > 23 ? 'text-lg' : product.title.length > 32 ? 'text-sm' : 'text-xl'} font-medium w-3/5`}
          >
            {product.title}
          </Text>
          {product.discount > 0 ? (
            <View>
              <Text className="line-through">
                {getPriceDisplay(product.price)}
              </Text>
              <Text className="text-2xl font-semibold">
                {getPriceDisplay(product)}
              </Text>
              <View className="bg-red-500 rounded-md px-2 py-1 ml-auto">
                <Text className="text-white text-xs sm:text-sm">
                  {product.discount}% off
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-2xl font-semibold">
              {getPriceDisplay(product)}
            </Text>
          )}
        </View>
        <Divider className="my-8" />
        <Accordions
          product={product}
          comments={comments}
          isCommentsLooading={isCommentsLooading}
        />
      </View>
    </>
  );
};

export default Details;
