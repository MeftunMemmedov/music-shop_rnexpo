import { CategoryIcon } from '@/assets/images';
import { Text } from '@/components/AppText';
import {
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Category } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';
import { Image, Pressable, View } from 'react-native';

const CategoryAccordion = ({ category }: { category: Category }) => {
  return (
    <AccordionItem value={category.id} className="mb-4">
      <AccordionHeader>
        <Link
          href={{
            pathname: '/categories/[categoryQuery]',
            params: {
              title: category.title,
              categoryQuery: category.slug,
              slug: category.slug,
            },
          }}
          asChild
        >
          <Pressable className="bg-gray-200 w-full h-32 rounded-2xl flex-row items-center justify-between px-5">
            <View className="flex-row items-center gap-3">
              <View className="size-20 rounded-full">
                <Image
                  source={
                    category.image ? { uri: category.image } : CategoryIcon
                  }
                  className="w-11/12 aspect-square"
                />
              </View>
              <Text>{category.title}</Text>
            </View>
            {category.children && category.children.length > 0 && (
              <AccordionTrigger className="flex-row items-center w-auto">
                {({ isExpanded }: { isExpanded: boolean }) => (
                  <Entypo
                    name={
                      isExpanded ? 'chevron-small-up' : 'chevron-small-down'
                    }
                    size={24}
                    color="black"
                  />
                )}
              </AccordionTrigger>
            )}
          </Pressable>
        </Link>
      </AccordionHeader>
      {category.children && category.children.length > 0 && (
        <AccordionContent>
          {category.children.map((child) => (
            <Link
              key={`child-of-${category.id}-${child.id}`}
              href={{
                pathname: '/categories/[categoryQuery]',
                params: {
                  title: child.title,
                  slug: child.slug,
                  categoryQuery: child.slug,
                },
              }}
              asChild
            >
              <Pressable className="py-3 flex-row items-center gap-2 border-b border-gray-400">
                <View className="size-14 rounded-full">
                  <Image
                    source={child.image ? { uri: child.image } : CategoryIcon}
                    className="size-3/5 aspect-square m-auto"
                  />
                </View>
                <AccordionContentText>{child.title}</AccordionContentText>
                {/* <Divider /> */}
              </Pressable>
            </Link>
          ))}
        </AccordionContent>
      )}
    </AccordionItem>
  );
};

export default CategoryAccordion;
