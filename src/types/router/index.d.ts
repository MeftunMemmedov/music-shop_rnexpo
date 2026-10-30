type DrawerNavLinks = {
  label: string;
  href: Href;
  icon: (props: { color: string }) => JSX.Element;
};

type ProductDetailsScreenParams = {
  slug: string;
  title: string;
};
