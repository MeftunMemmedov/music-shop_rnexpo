import { postData } from '@/api/helpers';
import { Text } from '@/components/AppText';
import SignInMessage from '@/components/SignInMessage';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { showToast } from '@/helpers/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUserComments } from '@/store/user';
import { Comment } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useQueryClient } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { Pressable } from 'react-native';

interface Props {
  slug: string;
}

const CommentFormModal = ({ slug }: Props) => {
  const dispatch = useAppDispatch();

  const { isAuth, info, userComments } = useAppSelector((store) => store.user);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [commentInput, setCommentInput] = useState<string>('');

  const toast = useToast();

  const queryClient = useQueryClient();
  const queryKey = [`comments/${slug}`];

  const uniqueId = useId();

  const addNewComment = async () => {
    if (commentInput === '') {
      showToast(
        toast,
        {
          description: 'Comment field cannot be blank!',
        },
        {
          id: `${slug}-cmmnt-blnk-err`,
          action: 'error',
        },
      );

      return;
    }

    const previouseComments = queryClient.getQueryData(queryKey);

    queryClient.setQueryData(queryKey, (old: Comment[]) => {
      const optimisticComment = {
        id: uniqueId,
        comment: commentInput,
        product: slug,
        created_at: Date.now(),
        user: {
          user_id: info?.user_id,
          user_name: info?.user_name,
        },
      };

      return old ? [...old, optimisticComment] : [optimisticComment];
    });

    try {
      setIsLoading(true);
      await postData('shop_comments', {
        user_id: info?.user_id,
        product: slug,
        comment: commentInput,
      });

      dispatch(clearUserComments());

      queryClient.invalidateQueries({ queryKey });

      showToast(
        toast,
        { description: 'Your comment has been added successfully!' },
        { id: `${slug}-cmmnt-add-scs`, action: 'success' },
      );

      setTimeout(() => {
        setShowModal(false);
      }, 500);
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE ADDING NEW COMMENT', error);

      if (previouseComments) {
        queryClient.setQueryData(queryKey, previouseComments);
      }

      showToast(
        toast,
        {
          description:
            'An error occured while adding new comment. Please try again!',
        },
        { id: `${slug}-cmmnt-add-err`, action: 'error' },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowCommentModal = () => {
    if (
      isAuth &&
      userComments?.some((comment) => comment.product.slug === slug)
    ) {
      showToast(
        toast,
        {
          description:
            'You cannot add multiple comment for single product! Please delete your existing comment or edit your exisited comment!',
        },
        { id: `${slug}-cmmnt-lmt-err`, action: 'error' },
      );
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Pressable onPress={handleShowCommentModal}>
        <Text className="text-gray-400 text-end">Add new comment</Text>
      </Pressable>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="bg-white rounded-xl">
          <ModalHeader className="justify-end">
            <ModalCloseButton>
              <AntDesign name="close" size={16} color="black" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {isAuth ? (
              <Textarea
                size="md"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={isLoading}
                className="w-full border-gray-300"
              >
                <TextareaInput
                  placeholder="Your comment..."
                  onChangeText={(text) => setCommentInput(text)}
                />
              </Textarea>
            ) : (
              <SignInMessage
                message="Please sign in to comment."
                onPress={() => setShowModal(false)}
              />
            )}
          </ModalBody>
          {isAuth && (
            <ModalFooter className="justify-content-end gap-3">
              <Pressable
                disabled={isLoading}
                className="px-8 py-2 bg-muted rounded-md"
                onPress={() => {
                  setCommentInput('');
                  setShowModal(false);
                }}
              >
                <Text className="text-center text-white font-medium">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                disabled={isLoading || commentInput === ''}
                className="px-8 py-2 bg-soft-blue rounded-md"
                onPress={addNewComment}
              >
                <Text className="text-center text-black font-medium">Add</Text>
              </Pressable>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentFormModal;
