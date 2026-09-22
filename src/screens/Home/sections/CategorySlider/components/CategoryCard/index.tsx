import { Text } from '@/components/AppText';
import ScaleView from '@/components/ScaleView';
import { Category } from '@/types';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';

interface Props {
  category: Category;
  isLastCategory: boolean;
}

const CategoryCard = ({ category, isLastCategory }: Props) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Link
      href={{
        pathname: '/categories/[categoryQuery]',
        params: {
          categoryQuery: category.slug,
          title: category.title,
          slug: category.slug,
        },
      }}
      asChild
    >
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className={`flex-column items-center max-md:w-20 gap-2 ${!isLastCategory ? 'max-md:mr-6 mr-8' : ''}`}
      >
        <ScaleView
          pressedState={isPressed}
          className="max-md:w-16 w-20 mt-4 aspect-square rounded-full border border-white bg-[#3A2C27]"
        >
          <View className="w-11/12 bg-white aspect-square rounded-full m-auto">
            <Image
              source={{ uri: category.image }}
              className="size-3/5 object-contain scale-90 m-auto"
            />
          </View>
        </ScaleView>
        <View className="w-24 items-center">
          <Text className="text-center " numberOfLines={2}>
            {category.title}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default CategoryCard;
