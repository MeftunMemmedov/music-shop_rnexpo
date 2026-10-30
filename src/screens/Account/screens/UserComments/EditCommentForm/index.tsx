import { Text } from '@/components/AppText';
import { MovingDotLoader } from '@/components/MovingDotLoader';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { getPriceDisplay } from '@/helpers/product';
import { showToast } from '@/helpers/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { editUserComment } from '@/store/user/asyncThunks';
import { Comment } from '@/types';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import DeleteDialog from './components/DeleteDialog';

const EditCommentForm = ({ userComment }: { userComment: Comment }) => {
  const { isConnected } = useNetInfo();

  const {
    userComments,
    status: {
      comments: { updating },
    },
  } = useAppSelector((store) => store.user);

  const dispatch = useAppDispatch();

  const [isEditFormActive, setIsEditFormActive] = useState<boolean>(false);
  const [editCommentInput, setEditCommentInput] = useState<string>(
    userComment.comment || '',
  );

  const toast = useToast();

  const queryClient = useQueryClient();
  const queryKey = [`comments/${userComment.product.slug}`];

  const handleEditUserComment = async () => {
    const previouseComments = queryClient.getQueryData(queryKey);
    try {
      if (editCommentInput === '') {
        showToast(
          toast,
          { description: 'Comment field cannot be blank!' },
          {
            id: `${userComment.id}-cmmnt-blnk-err`,
            action: 'error',
          },
        );
        return;
      }

      if (editCommentInput === userComment.comment) {
        showToast(
          toast,
          {
            description: 'New comment cannot be the same as previous!',
          },
          {
            id: `${userComment.id}-same-commnt-err`,
            action: 'error',
          },
        );

        return;
      }

      const editUserCommentRes = await dispatch(
        editUserComment({
          commentId: userComment.id,
          prevComments: userComments,
          comment: editCommentInput,
        }),
      );

      queryClient.setQueryData(queryKey, (old: Comment[]) => {
        if (!old) return old;
        return old.map((comment) => {
          if (comment.id === userComment.id) {
            return { ...comment, comment: editCommentInput };
          } else {
            return comment;
          }
        });
      });

      if (editUserComment.rejected.match(editUserCommentRes)) {
        showToast(
          toast,
          {
            description:
              'An error occured while editing comment. Please try again!',
          },
          {
            id: `${userComment.id}-edt-cmmnt-err`,
            action: 'error',
          },
        );

        return;
      }
      setIsEditFormActive(false);

      showToast(
        toast,
        {
          description: 'Your comment has been edited successfully!',
        },
        {
          id: `${userComment.id}-cmmnt-scs`,
          action: 'success',
        },
      );
    } catch (error) {
      if (previouseComments) {
        queryClient.setQueryData(queryKey, previouseComments);
      }

      setIsEditFormActive(false);

      showToast(
        toast,
        {
          description:
            'An unexpected error occured while editing your comment. Please try again!',
        },
        {
          id: `${userComment.id}-cmmnt-unxpctd-err`,
          action: 'error',
        },
      );
    }
  };

  return (
    <View className="mb-5 bg-white shadow-sm shadow-black rounded-md p-3">
      <Link href={`/products/${userComment.product.slug}`} className="mb-2">
        <Image
          source={{ uri: userComment.product.images[0] }}
          width={44}
          height={44}
          className="size-11 aspect-square object-contain"
        />
        <View className="w-80 pl-2">
          <Text
            className="font-semibold w-3/4"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userComment.product.title}
          </Text>
          <Text className="text-sm">
            {getPriceDisplay(userComment.product.price)}
          </Text>
        </View>
      </Link>
      <View>
        <Textarea
          size="md"
          isReadOnly={!isEditFormActive}
          isInvalid={false}
          isDisabled={!isEditFormActive || updating?.[userComment.id]}
          className="w-full border-gray-300 mb-2"
        >
          <TextareaInput
            placeholder="Your comment..."
            value={editCommentInput}
            onChangeText={(text) => setEditCommentInput(text)}
          />
        </Textarea>
        {isConnected && (
          <View className="flex-row justify-end gap-3">
            {isEditFormActive && (
              <Pressable
                disabled={updating?.[userComment.id]}
                className="px-8 py-2 bg-muted rounded-md"
                onPress={() => {
                  setIsEditFormActive(false);
                }}
              >
                <Text className="text-center text-white font-medium">
                  Cancel
                </Text>
              </Pressable>
            )}
            {!isEditFormActive && (
              <DeleteDialog
                userComment={userComment}
                disabled={editCommentInput === '' || updating?.[userComment.id]}
              />
            )}
            <Pressable
              disabled={editCommentInput === '' || updating?.[userComment.id]}
              className="w-28 py-2 bg-soft-blue rounded-md"
              onPress={
                isEditFormActive
                  ? handleEditUserComment
                  : () => setIsEditFormActive(true)
              }
            >
              {updating?.[userComment.id] ? (
                <MovingDotLoader dotClassName="bg-black" />
              ) : (
                <Text className="text-center text-black font-medium">
                  {isEditFormActive ? 'Save' : 'Edit'}
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default EditCommentForm;
