import { getDataList } from '@/api/helpers';
import { useToast } from '@/components/ui/toast';
import { TOGGLE_WISHLIST_QUERY_KEY } from '@/constants/querykeys';
import { showToast } from '@/helpers/toast';
import { useAppSelector } from '@/store/hooks';
import { Product, WishlistItem, WishlistMutationProps } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

const useWishlist = () => {
  const router = useRouter();

  const { info, isAuth } = useAppSelector((store) => store.user);

  const wishlistKey = ['wishlist', isAuth ? info?.user_id : 'guest'];

  const query = useQuery({
    queryKey: wishlistKey,
    networkMode: 'online',
    enabled: isAuth,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!isAuth) {
        return queryClient.getQueryData<WishlistItem[]>(wishlistKey) || [];
      }

      const res = await getDataList<WishlistItem>('shop_wishlist', {
        select:
          '*,product(id,title,slug,images,price,discount,category(image),brand(title))',
      });

      return res || [];
    },
    staleTime: isAuth ? 1000 * 60 * 5 : Infinity,
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: TOGGLE_WISHLIST_QUERY_KEY,
    networkMode: isAuth ? 'offlineFirst' : 'always',
    onMutate: async ({ product, exists }: WishlistMutationProps) => {
      await queryClient.cancelQueries({ queryKey: wishlistKey });

      const previousWishlist: WishlistItem[] =
        queryClient.getQueryData(wishlistKey) || [];

      if (!isAuth && previousWishlist.length > 5 && !exists) {
        router.push('/auth/signin');
        return;
      }

      queryClient.setQueryData(wishlistKey, (old: WishlistItem[] = []) => {
        if (exists) {
          return old.filter((wlItem) => wlItem.product.id !== product.id);
        } else {
          return [...old, { product, user_id: info?.user_id }];
        }
      });

      showToast(
        toast,
        {
          title: `${exists ? 'Removed' : 'Added'}!`,
          description: exists
            ? 'Removed from wishlist successfully'
            : 'Added to wishlist successfully',
          href: '/account/wishlist?title=Wishlist',
        },
        {
          id: product.id + `-wl-${exists ? 'rmv' : 'add'}-scs`,
          action: exists ? 'muted' : 'success',
          withLink: !exists,
          placement: exists ? 'top' : 'bottom',
        },
      );

      return { previousWishlist };
    },

    onError: (_err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKey, context.previousWishlist);
      }

      showToast(
        toast,
        {
          description: 'An error occured while toggling wishlist!',
        },
        {
          id: variables.product.id + '-wl-tggl-err',
          action: 'error',
        },
      );
    },

    onSettled: (_date, _err) => {
      if (isAuth) {
        queryClient.invalidateQueries({ queryKey: wishlistKey });
      }
    },
  });

  return {
    // ITEMS
    ...query,
    items: query.data || [],
    count: query.data?.length || 0,
    isInWishlist: (productId: string) =>
      query.data?.some((wlItem) => wlItem.product.id === productId) ?? false,
    // MUTATION
    ...mutation,
    toggle: (product: Product) => {
      const currentWishlist =
        queryClient.getQueryData<WishlistItem[]>(wishlistKey) || [];

      const exists = currentWishlist.some(
        (wlItem) => wlItem.product.id === product.id,
      );

      mutation.mutate({ product, user_id: info?.user_id, isAuth, exists });
    },
  };
};

export default useWishlist;
