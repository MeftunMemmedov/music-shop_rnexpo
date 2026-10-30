import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { useAppSelector } from '@/store/hooks';
import { Product } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  product: Product;
  isActionSheetVisible: boolean;
  setIsActionSheetVisible: Dispatch<SetStateAction<boolean>>;
  handleToggleCart: (
    product: Product,
    quantity: number,
    user_id: string,
  ) => void;
  handleToggleWishlist: (product: Product) => void;
  isProductInWishlist: boolean | undefined;
  isProductInCart: boolean;
}

const ProductActionSheet = ({
  product,
  isActionSheetVisible,
  setIsActionSheetVisible,
  isProductInCart,
  handleToggleCart,
  handleToggleWishlist,
  isProductInWishlist,
}: Props) => {
  const handleClose = () => setIsActionSheetVisible(false);

  const { info } = useAppSelector((store) => store.user);

  return (
    <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetItem
          onPress={() => {
            handleToggleWishlist(product);
            handleClose();
          }}
        >
          {isProductInWishlist ? (
            <Entypo name="heart" size={18} color="red" />
          ) : (
            <Entypo name="heart-outlined" size={18} color="black" />
          )}
          <ActionsheetItemText className="font-semibold">
            {isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem
          onPress={() => {
            handleToggleCart(product, 1, info?.user_id || '');
            handleClose();
          }}
        >
          {isProductInCart ? (
            <MaterialCommunityIcons
              name="cart-remove"
              size={18}
              color="black"
            />
          ) : (
            <MaterialCommunityIcons name="cart-plus" size={18} color="black" />
          )}
          <ActionsheetItemText className="font-semibold">
            {isProductInCart ? 'Remove from cart' : 'Add to cart'}
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem disabled isDisabled />
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default ProductActionSheet;

// <ActionsheetItem onPress={handleClose}>
//   <ActionsheetItemText>Remind Me</ActionsheetItemText>
// </ActionsheetItem>
// <ActionsheetItem onPress={handleClose}>
//   <ActionsheetItemText>Add to Saved Items</ActionsheetItemText>
// </ActionsheetItem>
// <ActionsheetItem isDisabled onPress={handleClose}>
//   <ActionsheetItemText>Delete</ActionsheetItemText>
// </ActionsheetItem>
