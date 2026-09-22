import { Accordion } from '@/components/ui/accordion';
import { useCategories } from '@/hooks/query';
import { FlatList } from 'react-native';
import CategoryAccordion from './components/CategoryAccordion';

const CategoryAccordionList = () => {
  const { data: categories } = useCategories();

  if (!categories || categories.length === 0) return null;
  return (
    <Accordion className="bg-transparent rounded-2xl" variant="unfilled">
      <FlatList
        scrollEnabled={false}
        data={categories}
        keyExtractor={({ id }) => `category-${id}`}
        renderItem={({ item: category }) => (
          <CategoryAccordion category={category} />
        )}
      />
    </Accordion>
  );
};

export default CategoryAccordionList;
