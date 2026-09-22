import { useToast } from '@/components/ui/toast';
import { showToast } from '@/helpers/toast';
import {
  deleteMultipleCartItems,
  toggleCart,
  updateQuantity,
} from '@/store/cart/asyncThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Product } from '@/types';
import { useRouter } from 'expo-router';

const useCart = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { items, count, total } = useAppSelector((store) => store.cart);

  const { info, isAuth } = useAppSelector((store) => store.user);

  const toast = useToast();

  const getProductInCart = (productId: string) =>
    items?.find((cartItem) => cartItem.product.id === productId);

  const handleToggleCart = async (product: Product, quantity: number) => {
    const isProductInCart = !!getProductInCart(product.id);

    showToast(
      toast,
      {
        title: `${isProductInCart ? 'Removed' : 'Added'}!`,
        description: `${
          isProductInCart
            ? 'Removed from cart successfully'
            : 'Added to cart successfully'
        }`,
        href: '/(drawer)/(tabs)/cart',
      },
      {
        id: product.id + `crt-${isProductInCart ? 'rmv' : 'add'}-scs`,
        action: isProductInCart ? 'muted' : 'success',
        withLink: !isProductInCart,
      },
    );

    if (!isAuth && count > 5 && !isProductInCart) {
      router.push('/auth/signin');
      return;
    }

    try {
      const toggleCartRes = await dispatch(
        toggleCart({
          item: { product, quantity: quantity },
          user_id: info?.user_id || '',
          prevItems: items,
        }),
      );

      if (toggleCart.rejected.match(toggleCartRes)) {
        showToast(
          toast,
          {
            description: 'An error occured while toggling cart!',
          },
          {
            action: 'error',
            id:
              product.id + `crt-tggl-(${isProductInCart ? 'rmv' : 'add'})-err`,
          },
        );

        return;
      }
    } catch (error) {
      console.error(error);
      showToast(
        toast,
        {
          description:
            'An unexpected error occured while toggling item to cart. Please try again',
        },
        {
          id: product.id + `crt-tgl-err`,
          action: 'error',
        },
      );
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    showToast(
      toast,
      { description: `Quantitiy updated to ${quantity}!` },
      {
        id: productId + 'crt-qty-updt-scs:' + quantity,
        action: 'success',
      },
    );
    try {
      const updateCartItemQuantityRes = await dispatch(
        updateQuantity({ productId, quantity, prevItems: items }),
      );

      if (updateQuantity.rejected.match(updateCartItemQuantityRes)) {
        showToast(
          toast,
          {
            description: 'An error occured while updating quantity!',
          },
          {
            id: productId + `crt-qty-updt-err: ${quantity}`,
            action: 'error',
          },
        );
        return;
      }
    } catch (error) {
      console.error(error);
      showToast(
        toast,
        {
          description:
            'An unexpected error occured while updating quantity. Please try again!',
        },
        {
          id: productId + `crt-qty-uptd-u-err`,
          action: 'error',
        },
      );
    }
  };

  const handleDeleteMultipleCartItems = async (
    productIds: string[],
    user_id: string,
  ) => {
    showToast(
      toast,
      {
        title: `Removed ${productIds.length} items!`,
        description: 'Selected items have been removed',
      },
      {
        id: 'mtlpl-crt-dlt-scs',
        action: 'success',
      },
    );
    try {
      const deleteMutipleCartItemsRes = await dispatch(
        deleteMultipleCartItems({
          productIds,
          user_id,
          prevItems: items,
        }),
      );

      if (deleteMultipleCartItems.rejected.match(deleteMutipleCartItemsRes)) {
        showToast(
          toast,
          {
            description: 'An error occured while deleting multiple cart items!',
          },
          {
            id: 'mltpl-crt-dlt-err',
            action: 'error',
          },
        );

        return;
      }
    } catch (error) {
      showToast(
        toast,
        {
          description:
            'An unexpected error occured while deleting multiple cart items. Please try again!',
        },
        {
          id: 'mtlpl-crt-dlt-u-err',
          action: 'error',
        },
      );
    }
  };

  return {
    items,
    count,
    total,
    getProductInCart,
    handleToggleCart,
    handleUpdateQuantity,
    handleDeleteMultipleCartItems,
  };
};

export default useCart;
