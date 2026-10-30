import { CartItem, WishlistItem } from '@/types';
import { getDataList, postData } from '.';

export const getUserCart = async () => {
  return await getDataList<CartItem>('shop_cart', {
    select: '*,product(*)',
  });
};

export const syncUserCart = async (localItems: CartItem[], user_id: string) => {
  try {
    const userCart = await getUserCart();

    if (userCart) {
      const userCartIds = new Set(userCart.map((item) => item.product.id));
      const cartSyncPromises = localItems
        .filter((localItem) => !userCartIds.has(localItem.product.id))
        .map((localItem) => {
          const {
            product: { id: product_id },
            quantity,
          } = localItem;

          return postData('shop_cart', {
            product: product_id,
            user_id,
            quantity,
          });
        });

      await Promise.allSettled(cartSyncPromises);
    }
  } catch (error) {
    console.error(`AN ERROR OCCURED WHILE CART SYNC`, error);
  }
};

export const syncUserWishlist = async (
  localItems: WishlistItem[],
  user_id: string,
) => {
  try {
    const userWishlist = await getDataList<WishlistItem>('shop_wishlist', {
      select: '*,product(*)',
    });

    if (userWishlist) {
      const userWishlistIds = new Set(
        userWishlist.map((item) => item.product.id),
      );
      const wishlistSyncPromises = localItems
        .filter((localItem) => !userWishlistIds.has(localItem.product.id))
        .map((localItem) => {
          const {
            product: { id: product_id },
          } = localItem;

          return postData('shop_wishlist', {
            product: product_id,
            user_id,
          });
        });

      await Promise.allSettled(wishlistSyncPromises);
    }
  } catch (error) {
    console.error(`AN ERROR OCCURED WHILE WISHLIST SYNC`, error);
  }
};
