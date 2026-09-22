import { useCategories } from '@/hooks/query';
import { FlatList, View } from 'react-native';
import CategoryCard from './components/CategoryCard';

const CategorySlider = () => {
  const { data: categories, error } = useCategories();

  if (!categories || categories.length === 0 || error) return null;
  return (
    <View className="w-full max-md:h-36 h-32 mb-8 overflow-hidden">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={'fast'}
        snapToAlignment="center"
        data={categories}
        contentContainerClassName="md:px-5"
        keyExtractor={({ id, title }) => `featured-category-${id}-${title}`}
        renderItem={({ item: category, index }) => (
          <CategoryCard
            category={category}
            isLastCategory={index === categories.length - 1}
          />
        )}
      ></FlatList>
    </View>
  );
};

export default CategorySlider;
