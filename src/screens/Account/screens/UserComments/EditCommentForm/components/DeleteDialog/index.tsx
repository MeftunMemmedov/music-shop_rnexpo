import { Text } from '@/components/AppText';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { showToast } from '@/helpers/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteUserComment } from '@/store/user/asyncThunks';
import { Comment } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

interface Props {
  disabled: boolean | undefined;
  userComment: Comment;
}

const DeleteDialog = ({ disabled, userComment }: Props) => {
  const { info } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const {
    userComments,
    status: {
      comments: { updating },
    },
  } = useAppSelector((store) => store.user);

  const queryClient = useQueryClient();
  const queryKey = [`comments/${userComment.product.slug}`];

  const commentId = userComment.id;

  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const handleClose = () => setShowAlertDialog(false);

  const toast = useToast();

  const handleDeleteComment = async () => {
    const previouseComments = queryClient.getQueryData(queryKey);
    try {
      const deleteUserCommentRes = await dispatch(
        deleteUserComment({ commentId, prevComments: userComments }),
      );

      if (deleteUserComment.rejected.match(deleteUserCommentRes)) {
        showToast(
          toast,
          {
            description:
              'An error occured while deleting comment. Please try again!',
          },
          { id: `${commentId}-cmmnt-dlt-err`, action: 'error' },
        );

        return;
      }

      queryClient.setQueryData(queryKey, (old: Comment[]) => {
        return old?.filter((comment) => comment.id !== commentId);
      });

      queryClient.invalidateQueries({ queryKey });

      showToast(
        toast,
        { description: 'Your comment has been deleted successfully!' },
        { id: `${commentId}-cmmnt-dlt-scs`, action: 'success' },
      );

      setShowAlertDialog(false);
    } catch (error) {
      if (previouseComments) {
        queryClient.setQueryData(queryKey, previouseComments);
      }

      showToast(
        toast,
        {
          description:
            'An unexpected error occured while deleting your comment. Please try again!',
        },
        {
          id: `${userComment.id}-cmmnt-unxpctd-err`,
          action: 'error',
        },
      );
    }
  };

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setShowAlertDialog(true)}
        className="px-8 py-2 bg-red-500 rounded-md"
      >
        <Text className="text-center text-white font-medium">Delete</Text>
      </Pressable>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            {updating?.[commentId] ? (
              <View>
                <ActivityIndicator className="text-charcoal" size={'large'} />
              </View>
            ) : (
              <Text className="text-foreground font-semibold text-lg pb-3">
                Are you sure you want to delete this comment?
              </Text>
            )}
          </AlertDialogHeader>
          {/* <AlertDialogBody className="mt-3 mb-4">
            <Text className="text-sm text-muted-foreground">
              Deleting the post will remove it permanently and cannot be undone.
              Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody> */}
          <AlertDialogFooter>
            <Pressable
              disabled={updating?.[commentId]}
              className="px-8 py-2 bg-soft-blue rounded-md"
              onPress={() => {
                setShowAlertDialog(false);
              }}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={updating?.[commentId]}
              className="px-8 py-2 bg-red-500 rounded-md"
              onPress={handleDeleteComment}
            >
              <Text className="text-white">Delete</Text>
            </Pressable>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;
