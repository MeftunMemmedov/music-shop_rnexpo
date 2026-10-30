import { PRODUCT_SELECT_PARAM } from '@/constants/params';
import { CartItem, Category, Product, ProductFilterParams } from '@/types';

export const getProductPrice = (product: Product) => {
  return product.price - (product.price * product.discount) / 100;
};

export const getPriceDisplay = (
  value: number | Product,
  withFixed: boolean = true,
) => {
  let price: number = 0;
  if (typeof value === 'object') price = getProductPrice(value);
  else price = value;

  if (!withFixed) return `${Number(price)} AZN`;

  return `${price.toFixed(2)} AZN`;
};

export const getSubtotal = (items: Product[]) => {
  return items.reduce((acc, item) => {
    return acc + getProductPrice(item);
  }, 0);
};

export const getTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => {
    return acc + getProductPrice(item.product) * item.quantity;
  }, 0);
};

export const appendProductSearchParams = (
  urlSearchParams: URLSearchParams,
  searchParams: ProductFilterParams,
  categories?: NoInfer<Category[]>,
): URLSearchParams => {
  const {
    categoryQuery,
    brandQuery,
    priceQuery_gte,
    priceQuery_lte,
    orderQuery,
  } = searchParams;

  urlSearchParams.append('select', PRODUCT_SELECT_PARAM);

  if (categoryQuery) {
    const currentParent = categories?.find((c) => c.slug === categoryQuery);
    const categoryHasChildren =
      currentParent?.children && currentParent.children.length > 0;

    if (categoryHasChildren) {
      const childSlugs = currentParent?.children.map((c) => c.slug);
      urlSearchParams.set('category', `in.(${childSlugs.join(',')})`);
    } else {
      urlSearchParams.set('category', `eq.${categoryQuery}`);
    }
  }

  if (brandQuery) {
    urlSearchParams.append('brand', `eq.${brandQuery}`);
  }

  if (priceQuery_gte) {
    urlSearchParams.append('final_price', `gte.${priceQuery_gte}`);
  }
  if (priceQuery_lte) {
    urlSearchParams.append('final_price', `lte.${priceQuery_lte}`);
  }

  if (orderQuery) {
    urlSearchParams.append('order', String(orderQuery));
  }

  return urlSearchParams;
};

export const resolveCategorySlugsForQuery = (
  categorySlug: string | undefined,
  categories: Category[] | undefined,
): string[] | null => {
  if (!categorySlug) return null;
  const parent = categories?.find((c) => c.slug === categorySlug);
  if (parent?.children && parent.children.length > 0) {
    return parent.children.map((c) => c.slug);
  }
  return [categorySlug];
};
