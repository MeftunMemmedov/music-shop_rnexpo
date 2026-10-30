import { getCart } from '@/store/cart/asyncThunks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUser, getUserComments } from '@/store/user/asyncThunks';
import { ReactNode, useEffect } from 'react';

const InitialDataDIspatcher = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  // const { categories, brands, slides } = useAppSelector((store) => store.data);
  const { items } = useAppSelector((store) => store.cart);
  const { isRequestFinished, isAuth, userComments } = useAppSelector(
    (store) => store.user,
  );

  // USER DISPATCHES
  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (isRequestFinished && isAuth && userComments === null)
      dispatch(getUserComments());
  }, [isRequestFinished, isAuth, userComments]);

  // INVENTORY DISPATCHES
  useEffect(() => {
    if (isRequestFinished && items === null) {
      dispatch(getCart());
    }
  }, [items, isRequestFinished]);

  return <>{children}</>;
};

export default InitialDataDIspatcher;
