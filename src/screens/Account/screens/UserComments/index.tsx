import EmptyScreen from '@/components/EmptyScreen';
import LoadingScreen from '@/components/LoadingScreen';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserComments } from '@/store/user/asyncThunks';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import EditCommentForm from './EditCommentForm';

const UserComments = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    userComments,
    status: {
      comments: {
        init: { loading: isCommentsLoading },
      },
    },
  } = useAppSelector((store) => store.user);

  const onRefresh = () => {
    dispatch(getUserComments());
  };

  useEffect(() => {
    router.setParams({ title: 'My Comments' });
  }, []);

  if (isCommentsLoading) return <LoadingScreen />;
  // if (!isConnected) return <NoConnectionScreen refresh={onRefresh} />;
  return (
    <FlatList
      scrollEnabled
      className="flex-1 container"
      keyExtractor={({ id }) => `user-comment-${id}`}
      contentContainerClassName="flex-grow pb-10"
      data={userComments}
      refreshing={isCommentsLoading}
      refreshControl={
        <RefreshControl refreshing={isCommentsLoading} onRefresh={onRefresh} />
      }
      ListEmptyComponent={<EmptyScreen message="No comment found" />}
      // ListHeaderComponent={
      //   <Text className="py-5 font-semibold text-2xl">My Comments</Text>
      // }
      renderItem={({ item }) => <EditCommentForm userComment={item} />}
    />
  );
};

export default UserComments;
