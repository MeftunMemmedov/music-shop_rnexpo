import AccordionRow from '@/components/AccordionRow';
import { Accordion } from '@/components/ui/accordion';
import { Divider } from '@/components/ui/divider';
import {
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPriceDisplay, getProductPrice } from '@/helpers/product';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const CartInfo = () => {
  const router = useRouter();
  const { items, total, count } = useAppSelector((store) => store.cart);

  const tableHeadings = ['Product', 'Quantity', 'Subtotal'];

  useEffect(() => {
    if (items === null) router.replace('/cart');
  }, [items]);

  if (!items) return null;
  return (
    <Accordion type="single" className="my-4" variant="unfilled">
      <AccordionRow
        title={`Cart Info (${count})`}
        value="checkout-cart-info"
        content={
          <Table className="w-full mb-10">
            <TableHeader>
              <TableRow>
                {tableHeadings.map((heading) => (
                  <TableHead key={`heading-${heading}`}>{heading}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((cartItem) => (
                <TableRow key={`cartitem-${cartItem.product.id}`}>
                  <TableData
                    className="text-sm"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {cartItem.product.title}
                  </TableData>
                  <TableData className="text-center">
                    {cartItem.quantity}
                  </TableData>
                  <TableData className="text-sm text-right">
                    {getPriceDisplay(
                      getProductPrice(cartItem.product) * cartItem.quantity,
                    )}
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
                <TableHead className="text-sm">
                  {getPriceDisplay(total)}
                </TableHead>
              </TableRow>
            </TableFooter>
          </Table>
        }
      />
      <Divider />
    </Accordion>
  );
};

export default CartInfo;
