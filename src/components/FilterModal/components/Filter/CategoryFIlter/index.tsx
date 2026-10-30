import AccordionRow from '@/components/AccordionRow';
import { Text } from '@/components/AppText';
import { useCategories } from '@/hooks/query';
import { Pressable } from 'react-native';
import SelectedIcon from '../../../../Selected';

interface Props {
  isInProductsByCategoryScreen?: boolean;
  categoryQuery?: string | string[];
  categorySlug: string | string[];
  onChange: (query?: string) => void;
}

const CategoryFilter = ({
  categorySlug,
  categoryQuery,
  isInProductsByCategoryScreen,
  onChange,
}: Props) => {
  const { data: categories } = useCategories();

  const isCategorySelected = (slug: string) => categoryQuery === slug;

  if (!categories || categories.length === 0) return null;

  const parentCategory = categories.find(
    (c) => c.slug === categorySlug && c.parent_slug === null,
  );

  if (isInProductsByCategoryScreen) {
    if (parentCategory) {
      return (
        <>
          <AccordionRow
            key={`accordion-category-filter-${parentCategory.id}`}
            title={parentCategory.title}
            value={parentCategory.slug}
            onPress={() => {
              if (!categoryQuery || !isCategorySelected(parentCategory.slug))
                onChange(parentCategory.slug);
            }}
            isActive={
              isCategorySelected(parentCategory.slug) ||
              categorySlug === parentCategory.slug
            }
            content={parentCategory.children.map((child) => (
              <Pressable
                key={`category-${child.id}`}
                className="mb-3 flex-row items-center gap-2"
                onPress={() => {
                  onChange(
                    isCategorySelected(child.slug)
                      ? parentCategory.slug
                      : child.slug,
                  );
                }}
              >
                <SelectedIcon isSelected={isCategorySelected(child.slug)} />
                <Text
                  className={
                    isCategorySelected(child.slug) ||
                    categorySlug === child.slug
                      ? 'font-bold'
                      : ''
                  }
                >
                  {child.title}
                </Text>
              </Pressable>
            ))}
          />
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <AccordionRow
      title="Category"
      content={categories.map((category) =>
        category.children && category.children.length > 0 ? (
          <AccordionRow
            key={`accordion-category-filter-${category.id}`}
            title={category.title}
            value={category.slug}
            onPress={() => {
              onChange(
                isCategorySelected(category.slug) ? undefined : category.slug,
              );
            }}
            isActive={categoryQuery === category.slug}
            content={category.children.map((child) => (
              <Pressable
                key={`category-${child.id}`}
                className="mb-3 flex-row items-center gap-2"
                onPress={() => {
                  onChange(
                    isCategorySelected(child.slug) ? undefined : child.slug,
                  );
                }}
              >
                <SelectedIcon isSelected={isCategorySelected(child.slug)} />
                <Text
                  className={isCategorySelected(child.slug) ? 'font-bold' : ''}
                >
                  {child.title}
                </Text>
              </Pressable>
            ))}
          />
        ) : (
          <Pressable
            key={`category-${category.id}`}
            className="mb-2 flex-row items-center"
            onPress={() => {
              onChange(
                isCategorySelected(category.slug) ? undefined : category.slug,
              );
            }}
          >
            <SelectedIcon isSelected={isCategorySelected(category.slug)} />
            <Text
              className={`ml-4 ${isCategorySelected(category.slug) ? 'font-bold' : ''}`}
            >
              {category.title}
            </Text>
          </Pressable>
        ),
      )}
    />
  );
};

export default CategoryFilter;
