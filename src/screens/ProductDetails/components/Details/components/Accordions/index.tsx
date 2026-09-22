import AccordionRow from '@/components/AccordionRow';
import { Text } from '@/components/AppText';
import { MovingDotLoader } from '@/components/MovingDotLoader';
import { Accordion, AccordionContentText } from '@/components/ui/accordion';
import { createFakeImage } from '@/helpers/common';
import { Comment, Product } from '@/types';
import { format } from 'date-fns';
import { FlatList, Image, View } from 'react-native';
import CommentFormModal from './components/CommentFormModal';

interface Props {
  product: Product;
  comments: Comment[];
  isCommentsLooading: boolean;
}

const Accordions = ({ product, comments, isCommentsLooading }: Props) => {
  return (
    <Accordion
      type="multiple"
      defaultValue={['Description']}
      variant="unfilled"
    >
      <AccordionRow
        title="Description"
        content={
          <AccordionContentText>{product.description}</AccordionContentText>
        }
      />
      {isCommentsLooading ? (
        <MovingDotLoader dotClassName="bg-black" />
      ) : (
        <AccordionRow
          title={`Comments (${comments.length})`}
          content={
            <FlatList
              scrollEnabled={false}
              data={comments}
              keyExtractor={({ id }) => `${product.slug}-comment-${id}`}
              ListHeaderComponent={() => (
                <View className="pt-3 pb-5">
                  <CommentFormModal slug={product.slug} />
                </View>
              )}
              renderItem={({ item: comment }) => (
                <View className="mb-8">
                  <View className="flex-row justify-between items-end mb-4">
                    <View className="flex-row gap-4 w-3/5">
                      <Image
                        source={{ uri: createFakeImage(50, 50) }}
                        width={40}
                        height={40}
                        className="rounded-full aspect-square"
                      />
                      <Text
                        className="mt-2 text-sm font-medium w-4/5"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {comment.user.user_name}
                      </Text>
                    </View>

                    <Text className="text-xs text-right text-gray-400">
                      {format(comment.created_at, 'dd/MM/yyyy')}
                    </Text>
                  </View>
                  <View className="pb-2">
                    <Text>{comment.comment}</Text>
                  </View>
                </View>
              )}
            />
          }
        />
      )}
    </Accordion>
  );
};

export default Accordions;
